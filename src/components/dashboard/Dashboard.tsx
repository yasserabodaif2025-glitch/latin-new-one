'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GeneralInfo from './GeneralInfo'
import Reports from './Reports'
import Statistics from './Statistics'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

// Custom hooks
function useDimensions(ref: React.RefObject<any>): {
  width: number
  height: number
} {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 250)
    }

    // Initial measurement
    updateDimensions()

    window.addEventListener('resize', debouncedUpdateDimensions)

    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions)
      clearTimeout(timeoutId)
    }
  }, [ref])

  return dimensions
}

// AnimatedGradient component
interface AnimatedGradientProps {
  colors: string[]
  speed?: number
  blur?: 'light' | 'medium' | 'heavy'
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  speed = 5,
  blur = 'light',
}) => {
  const containerRef = useRef(null)
  const dimensions = useDimensions(containerRef)
  const [randomValues, setRandomValues] = useState<{ [key: string]: number }[]>([])

  // Generate random values on the client side only
  useEffect(() => {
    const values = colors.map(() => ({
      top: Math.random() * 50,
      left: Math.random() * 50,
      tx1: Math.random() - 0.5,
      ty1: Math.random() - 0.5,
      tx2: Math.random() - 0.5,
      ty2: Math.random() - 0.5,
      tx3: Math.random() - 0.5,
      ty3: Math.random() - 0.5,
      tx4: Math.random() - 0.5,
      ty4: Math.random() - 0.5,
      size: randomInt(0.5, 1.5),
    }))
    setRandomValues(values)
  }, [colors])

  const circleSize = React.useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  )

  const blurClass = blur === 'light' ? 'blur-2xl' : blur === 'medium' ? 'blur-3xl' : 'blur-[100px]'

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${blurClass}`}>
        {colors.map((color, index) => (
          <svg
            key={index}
            className="animate-background-gradient absolute"
            style={
              randomValues[index]
                ? ({
                    top: `${randomValues[index].top}%`,
                    left: `${randomValues[index].left}%`,
                    '--background-gradient-speed': `${1 / speed}s`,
                    '--tx-1': randomValues[index].tx1,
                    '--ty-1': randomValues[index].ty1,
                    '--tx-2': randomValues[index].tx2,
                    '--ty-2': randomValues[index].ty2,
                    '--tx-3': randomValues[index].tx3,
                    '--ty-3': randomValues[index].ty3,
                    '--tx-4': randomValues[index].tx4,
                    '--ty-4': randomValues[index].ty4,
                  } as React.CSSProperties)
                : {}
            }
            width={randomValues[index] ? circleSize * randomValues[index].size : 0}
            height={randomValues[index] ? circleSize * randomValues[index].size : 0}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={color}
              className="opacity-30 dark:opacity-[0.15]"
            />
          </svg>
        ))}
      </div>
    </div>
  )
}

// Stat Card Component
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  colors: string[]
  delay: number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay,
  icon,
  trend,
  trendValue,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="relative h-full overflow-hidden rounded-xl bg-background dark:bg-background/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 flex h-full flex-col p-4 text-foreground backdrop-blur-sm"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="mb-2 flex items-start justify-between">
          <motion.h3 className="text-sm font-medium text-foreground/80" variants={item}>
            {title}
          </motion.h3>
          <motion.div variants={item} className="text-primary">
            {icon}
          </motion.div>
        </div>
        <motion.p className="mb-1 text-2xl font-bold text-foreground" variants={item}>
          {value}
        </motion.p>
        {subtitle && (
          <motion.p className="mb-2 text-xs text-foreground/70" variants={item}>
            {subtitle}
          </motion.p>
        )}
        {trend && trendValue && (
          <motion.div variants={item} className="mt-auto flex items-center text-xs font-medium">
            {trend === 'up' ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500/20 bg-green-500/10 text-green-500"
              >
                <ArrowUp size={12} /> {trendValue}
              </Badge>
            ) : trend === 'down' ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-red-500/20 bg-red-500/10 text-red-500"
              >
                <ArrowDown size={12} /> {trendValue}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                {trendValue}
              </Badge>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Chart Components
interface ChartProps {
  delay: number
}

const LineChartComponent: React.FC<ChartProps> = ({ delay }) => {
  return (
    <motion.div
      className="flex h-full flex-col rounded-xl bg-background p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/80">Revenue Trend</h3>
        <Select defaultValue="monthly">
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-[200px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="300" y2="0" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="25" x2="300" y2="25" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeOpacity="0.1" />

            {/* Line chart */}
            <path
              d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,30 180,20 C200,10 220,15 240,5 C260,-5 280,10 300,15"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />

            {/* Area under the line */}
            <path
              d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,30 180,20 C200,10 220,15 240,5 C260,-5 280,10 300,15 L300,100 L0,100 Z"
              fill="url(#lineGradient)"
              fillOpacity="0.2"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-foreground/70">
        <div>Jan</div>
        <div>Apr</div>
        <div>Jul</div>
        <div>Oct</div>
      </div>
    </motion.div>
  )
}

const BarChartComponent: React.FC<ChartProps> = ({ delay }) => {
  return (
    <motion.div
      className="flex h-full flex-col rounded-xl bg-background p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/80">Sales by Category</h3>
        <Badge variant="outline" className="text-xs">
          Last 30 days
        </Badge>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-[200px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="300" y2="0" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="25" x2="300" y2="25" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeOpacity="0.1" />

            {/* Bar chart */}
            <rect x="20" y="30" width="30" height="70" fill="#3B82F6" rx="2" />
            <rect x="70" y="10" width="30" height="90" fill="#8B5CF6" rx="2" />
            <rect x="120" y="40" width="30" height="60" fill="#EC4899" rx="2" />
            <rect x="170" y="20" width="30" height="80" fill="#10B981" rx="2" />
            <rect x="220" y="50" width="30" height="50" fill="#F59E0B" rx="2" />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-foreground/70">
        <div className="text-center">Product A</div>
        <div className="text-center">Product B</div>
        <div className="text-center">Product C</div>
        <div className="text-center">Product D</div>
        <div className="text-center">Product E</div>
      </div>
    </motion.div>
  )
}

const PieChartComponent: React.FC<ChartProps> = ({ delay }) => {
  return (
    <motion.div
      className="flex h-full flex-col rounded-xl bg-background p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/80">User Distribution</h3>
        <Badge variant="outline" className="text-xs">
          Real-time
        </Badge>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-[180px] w-[180px]">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Pie chart segments */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#3B82F6"
              strokeWidth="20"
              strokeDasharray="75.4 176.6"
              strokeDashoffset="0"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#8B5CF6"
              strokeWidth="20"
              strokeDasharray="50.3 201.7"
              strokeDashoffset="-75.4"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#EC4899"
              strokeWidth="20"
              strokeDasharray="37.7 214.3"
              strokeDashoffset="-125.7"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="20"
              strokeDasharray="88.8 163.2"
              strokeDashoffset="-163.4"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-3 w-3 rounded-full bg-[#3B82F6]"></div>
          <span className="text-foreground/70">Premium (30%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
          <span className="text-foreground/70">Standard (20%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-3 w-3 rounded-full bg-[#EC4899]"></div>
          <span className="text-foreground/70">Basic (15%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
          <span className="text-foreground/70">Free (35%)</span>
        </div>
      </div>
    </motion.div>
  )
}

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const t = useTranslations('home.dashboard')

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-foreground/70">{t('welcome')}</p>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t('period.today')}</SelectItem>
                <SelectItem value="yesterday">{t('period.yesterday')}</SelectItem>
                <SelectItem value="this-week">{t('period.thisWeek')}</SelectItem>
                <SelectItem value="this-month">{t('period.thisMonth')}</SelectItem>
                <SelectItem value="this-year">{t('period.thisYear')}</SelectItem>
                <SelectItem value="custom">{t('period.custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('stat.totalRevenue')}
            value="$1,234,567"
            subtitle={t('stat.increase')}
            colors={['#3B82F6', '#60A5FA', '#93C5FD']}
            delay={0.1}
            icon={<DollarSign size={18} />}
            trend="up"
            trendValue="15%"
          />
          <StatCard
            title={t('stat.newUsers')}
            value="1,234"
            subtitle={t('stat.signup')}
            colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
            delay={0.2}
            icon={<Users size={18} />}
            trend="up"
            trendValue="8%"
          />
          <StatCard
            title={t('stat.conversionRate')}
            value="3.45%"
            subtitle={t('stat.increaseWeek')}
            colors={['#EC4899', '#F472B6', '#FBCFE8']}
            delay={0.3}
            icon={<TrendingUp size={18} />}
            trend="up"
            trendValue="0.5%"
          />
          <StatCard
            title={t('stat.avgResponseTime')}
            value="1.2s"
            subtitle={t('stat.decreaseWeek')}
            colors={['#10B981', '#34D399', '#6EE7B7']}
            delay={0.4}
            icon={<Clock size={18} />}
            trend="down"
            trendValue="0.3s"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="overflow-hidden lg:col-span-2">
            <Tabs defaultValue="revenue" className="h-full">
              <div className="flex items-center justify-between p-4">
                <TabsList>
                  <TabsTrigger value="revenue" className="flex items-center gap-2">
                    <LineChart size={14} />
                    <span>{t('tabs.revenue')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{t('tabs.users')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="conversions" className="flex items-center gap-2">
                    <Activity size={14} />
                    <span>{t('tabs.conversions')}</span>
                  </TabsTrigger>
                </TabsList>
                <Badge variant="outline" className="text-xs">
                  {t('badges.last30Days')}
                </Badge>
              </div>
              <Separator />
              <div className="h-[350px] p-4">
                <TabsContent value="revenue" className="mt-0 h-full">
                  <LineChartComponent delay={0.5} />
                </TabsContent>
                <TabsContent value="users" className="mt-0 h-full">
                  <BarChartComponent delay={0.5} />
                </TabsContent>
                <TabsContent value="conversions" className="mt-0 h-full">
                  <LineChartComponent delay={0.5} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium">{t('charts.userDistribution')}</h3>
              <p className="text-sm text-foreground/70">By subscription type</p>
            </div>
            <Separator />
            <div className="h-[350px] p-4">
              <PieChartComponent delay={0.6} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('table.recentSales')}</h3>
                <Badge>{t('badges.new')}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{t('table.latestTransactions')}</p>
            </div>
            <Separator />
            <div className="p-4">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Customer {i}</p>
                        <p className="text-xs text-foreground/70">
                          Product {String.fromCharCode(64 + i)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" suppressHydrationWarning>
                        ${(i * 234.56).toFixed(2)}
                      </p>
                      <p className="text-xs text-foreground/70" suppressHydrationWarning>
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('table.topProducts')}</h3>
                <Badge variant="outline">{t('badges.thisMonth')}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{t('table.byRevenue')}</p>
            </div>
            <Separator />
            <div className="p-4">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { name: t('charts.premium'), value: '$45,678', percent: 35 },
                  { name: t('charts.standard'), value: '$32,456', percent: 25 },
                  { name: t('charts.basic'), value: '$21,345', percent: 16 },
                  { name: t('charts.addOnApiAccess'), value: '$18,765', percent: 14 },
                  { name: t('charts.addOnExtraStorage'), value: '$12,876', percent: 10 },
                ].map((product, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm font-medium">{product.value}</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${product.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-foreground/70">
                      {product.percent}% of total
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('table.systemAlerts')}</h3>
                <Badge variant="destructive">{t('badges.destructive')}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{t('table.recentNotifications')}</p>
            </div>
            <Separator />
            <div className="p-4">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {[
                  { title: 'Server Load High', time: '5 minutes ago', level: 'critical' },
                  { title: 'Database Backup Completed', time: '1 hour ago', level: 'info' },
                  { title: 'API Rate Limit Reached', time: '3 hours ago', level: 'warning' },
                  { title: 'New User Registration Spike', time: '5 hours ago', level: 'info' },
                  { title: 'Payment Gateway Error', time: '1 day ago', level: 'critical' },
                ].map((alert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`mt-0.5 rounded-full p-1 ${
                        alert.level === 'critical'
                          ? 'bg-red-500/20 text-red-500'
                          : alert.level === 'warning'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-blue-500/20 text-blue-500'
                      }`}
                    >
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-foreground/70">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
