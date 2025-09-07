# Latin Academy Project Context

## Project Overview

The Latin Academy project is a Next.js application built with TypeScript and React. It appears to be a web application with internationalization support for English and Arabic languages. It is an educational institution management system with modules for courses, students, lecturers, campaigns, and messaging.

## Technology Stack

### Core Technologies

- **Next.js**: Version 15.1.6 (using the App Router architecture)
- **React**: Version 19.0.0
- **TypeScript**: Version 5+
- **Tailwind CSS**: For styling (v3.4.1)

### UI Libraries

- **Radix UI**: Many primitive components (accordions, avatars, dialog, etc.)
- **Shadcn UI**: Component library building on Radix (inferred from project structure)
- **Lucide React**: Icon library
- **React Hook Form**: Form handling with Zod validation

### Key Packages

- **next-intl**: Internationalization (supporting English and Arabic)
- **next-themes**: Theme management (likely light/dark)
- **SWR**: Data fetching and state management
- **@whiskeysockets/baileys**: WhatsApp integration
- **axios**: HTTP client
- **date-fns**: Date handling
- **react-dropzone**: File uploads
- **xlsx**: Excel file handling
- **sonner**: Toast notifications

## Project Structure

### Core Directories

- **/src/app**: Next.js App Router structure with route components
- **/src/components**: Reusable UI components
  - **/ui**: Shadcn UI components
  - **/layout**: Layout components
  - **/interface**: Interface components
  - **/table**: Table components
  - **/dashboard**: Dashboard-specific components
- **/src/lib**: Utility functions and configurations
  - **/hooks**: Custom React hooks
  - **/schema**: Zod validation schemas
  - **/const**: Constants
- **/src/i18n**: Internationalization setup

### App Features

The project appears to include:

1. **Internationalization**: Supporting English and Arabic
2. **WhatsApp Integration**: For messaging/campaigns
3. **Campaign Management**: For marketing campaigns
4. **Dashboard**: For data visualization and management
5. **Excel Upload**: Functionality for uploading Excel data
6. **Authentication**: Cookie-based auth system with token and refreshToken
7. **Educational Management**: Courses, lectures, students, and lecturers
8. **Lead Management**: CRM-like functionality for leads
9. **Location Management**: Areas, cities, branches geographic organization
10. **Resource Management**: Labs, agreements, and qualifications

### Main Application Domains

The application appears to be for an educational institution with the following domains:

1. **Academic Management**: Courses, course groups, lectures, and lecturers
2. **Student Management**: Student profiles and qualification tracking
3. **Marketing & CRM**: Campaigns, leads, and messaging
4. **Administrative**: Employees, branches, and agreements
5. **Messaging**: WhatsApp integration for communication

## API Structure

The application uses a RESTful API with the following key endpoints:

- Base URL: `http://198.7.125.213:5000/api/`

### Core Endpoints:

- **Auth**: `/Auth/login` for authentication
- **Branches**: `/Branches` for branch management
- **Categories**: `/Categories` for course categories
- **Rooms/Labs**: `/Rooms` for classroom/lab management
- **Instructors**: `/Instructors` for lecturer management
- **Employees**: `/Employees` for staff management
- **Students**: `/Students` for student management
- **Courses**: `/Courses` for course management
- **Cities**: `/Cityes` for city management
- **Areas**: `/Areaes` for area management
- **Campaigns**: `/Campaigns` for marketing campaigns
- **Groups**: `/Groups` for course groups
- **Sessions**: `/Sessions` for lectures
- **MessageTemplates**: `/MessageTemplates` for messaging
- **Leads**: `/Leads` for prospective student management

### API Pattern:

- Standard CRUD operations (GET, POST, PUT, DELETE)
- Pagination support via `/endpoint/pagination`
- Soft delete with restore functionality via `/endpoint/restore/:id`

## Key Architectural Patterns

1. **Next.js App Router**: Using the latest Next.js architecture with route folders
2. **Server Components**: Likely uses React Server Components (RSC) from Next.js 15
3. **Internationalized Routes**: Using [locale] path parameter for language switching
4. **Component Library**: Extensive use of Shadcn UI components built on Radix primitives
5. **Form Handling**: Uses React Hook Form with Zod validation
6. **Data Fetching**: Uses SWR for data fetching and state management
7. **API Communication**: Uses axios for HTTP requests with interceptors for auth
8. **Server Actions**: Uses Next.js 'use server' actions for server-side operations
9. **Abstract API Pattern**: Generic CRUD operations through AbstractApi class

## Internationalization

- Supports English (`en`) and Arabic (`ar`) locales
- Default locale is Arabic (`ar`)
- Uses `next-intl` for translation management
- Middleware-based locale routing

## Authentication

- Cookie-based authentication system
- Uses token and refreshToken stored in cookies
- Server-side token validation using Next.js middleware
- Axios interceptors for adding auth headers and handling 401 responses
- Automatic redirect to login page on auth failures

## Styling

- Uses Tailwind CSS for styling
- Uses `class-variance-authority` and `tailwind-merge` for conditional class names
- Likely has dark/light theme support via `next-themes`

## Development Workflow

- **Development**: `npm run dev --turbopack`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Linting**: `npm run lint`
- **Formatting**: `npm run format`

## WhatsApp Integration

The project appears to have WhatsApp integration using `@whiskeysockets/baileys` with UI components for:

- Connection status
- Message templates
- Phone number handling
- QR code scanning for WhatsApp Web connection

## Special Features

- Excel file upload and processing for data import
- QR code generation for WhatsApp connection
- Date range picking and calendar functionality
- Table operations with sorting and filtering
- Theme switching support
- Responsive design for mobile and desktop

## Component System

The project uses a comprehensive UI component library with:

- Form controls (inputs, selects, checkboxes)
- Feedback components (alerts, dialogs, toasts)
- Layout components (accordion, card, popover)
- Data display components (tables, avatars)
- Navigation components (breadcrumb, dropdown menu)

## Utility Functions

Several utility functions for:

- Time formatting (formatToAmPm, parseTime)
- Date manipulation (addHourToTime)
- API request handling (axiosInstance, AbstractApi)
- Window size detection (useWindowSize hook)
- SWR data fetchers

## Resource Pattern (e.g., Labs)

This pattern is applied across all resource modules (labs, branches, courses, etc.) in the application:

### 1. Server Actions

- All CRUD operations are implemented as async server actions using axiosInstance.
- Each action returns typed data, using interfaces for type safety.
- Additional fetchers for related data (e.g., types, categories) are included as needed.

### 2. Component Structure

- All resource-related components are grouped under a `(components)` subfolder inside the resource folder.
- Components include:
  - `resource-form.tsx`: Form for create/edit/view, using React Hook Form, Zod validation, and translations.
  - `resource-table.tsx`: Table for listing resources, using a generic AppTable component and column definitions.
  - `useResources.tsx` and similar: Custom hooks for fetching data, using useEffect and useState.
  - `resource.interface.ts`: TypeScript interfaces for resource shape.
  - `index.ts`: Barrel export for all resource components and interfaces.

### 3. Form Pattern

- Uses React Hook Form with Zod schema validation.
- Handles create, edit, and view modes via a `mode` prop.
- Uses translation hooks for labels and messages.
- Handles form submission with async server actions and toast notifications.
- Resets and navigation handled via router and reset.

### 4. Table Pattern

- Uses a generic AppTable component.
- Columns are defined with translation support.
- Data is passed as a prop.

### 5. Data Fetching Pattern

- Custom hooks fetch data using server actions.
- State is managed with useState and useEffect.
- Loading state is handled and returned.

### 6. Type Safety

- All data shapes are defined with interfaces.
- Zod schemas are used for validation.

### 7. Exports

- All components and interfaces are exported via a single index.ts for easy import.

## Rules Context for Resource Modules

- **Clean Code**: Single responsibility, meaningful names, DRY, encapsulation, code quality, and testing are all present in the pattern.
- **TypeScript**: Interfaces for data, strict typing, generics for hooks, and Zod for validation.
- **React/Next.js**: Functional components, hooks for logic, App Router conventions, server/client component separation, and translation support.
- **Tailwind**: All UI uses Tailwind utility classes.
- **General Structure**: Resource folders, (components) subfolder, index.ts barrel export, and clear separation of concerns.

## Schema Pattern (General)

- Define resource schemas using Zod for validation in `src/lib/schema/{resource}.schema.ts`.
- Each schema should:
  - Use descriptive field names matching the resource's data model.
  - Specify required and optional fields with appropriate Zod types and constraints (e.g., min, nonempty).
  - Enforce business rules at the schema level (e.g., min values, string requirements).
- Infer TypeScript types from Zod schemas for strong type safety and DRY code.
- Use the inferred types in forms, server actions, and components for validation and type inference.
- Keep all resource schemas organized in the `src/lib/schema` directory for maintainability and discoverability.

## Layout Pattern

- **Footer**: Uses translation, semantic HTML, Tailwind classes, and external link. Self-contained, accessible, and responsive.
- **Breadcrumb**: Dynamically generates navigation based on the current path, uses translation, and is client-side for reactivity.
- **Side Menu**: Responsive, uses translation, icons, and dynamic route mapping. Desktop and mobile variants, with a toggle for icon-only mode.
- **Nav Bar**: Responsive, includes language switcher, mode toggle, login modal, and logo. Uses Next.js Image for optimized logo rendering.
- **Exports**: All layout components are exported via index.ts for easy import and maintainability.

## Rules Context for Layout and Schema

- **Clean Code**: Single responsibility, meaningful names, DRY, encapsulation, code quality, and testing.
- **TypeScript**: Interfaces/types for props, strict typing, Zod for schema validation.
- **React/Next.js**: Functional components, hooks for logic, App Router conventions, server/client component separation, translation support.
- **Tailwind**: All UI uses Tailwind utility classes for styling.
- **General Structure**: Layout components grouped logically, index.ts barrel export, clear separation of concerns, and accessibility best practices.
