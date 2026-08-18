# DB SDK UI Package

A shared UI component library for the DB SDK monorepo. Built with shadcn/ui, Radix UI, and Tailwind CSS for consistent design across web and mobile applications.

## 🚀 Quick Start

### Installation

The UI package is automatically available in the monorepo workspace:

```bash
# No installation needed - it's a workspace dependency
# Just import and use in your apps
```

### Usage

```tsx
// In web app (apps/web/)
import { Button } from '@db-sdk/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@db-sdk/ui/components/card'

// In mobile app (apps/mobile/)
import { Button } from '@db-sdk/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@db-sdk/ui/components/card'
```

## 🛠️ Tech Stack

- **shadcn/ui**: Re-usable components built with Radix UI
- **Radix UI**: Headless UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe component definitions
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging utility

## 📁 Project Structure

```
packages/ui/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   ├── input.tsx      # Input component
│   │   └── index.ts       # Component exports
│   ├── lib/
│   │   ├── utils.ts       # Utility functions
│   │   └── globals.css    # Global styles
│   └── hooks/             # Custom React hooks
├── package.json           # Package configuration
├── components.json        # shadcn/ui configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Available Components

### Core Components

| Component | Description | Usage |
|-----------|-------------|-------|
| `Button` | Versatile button component with variants | `import { Button } from '@db-sdk/ui/components/button'` |
| `Card` | Container component for content | `import { Card, CardContent, CardHeader, CardTitle } from '@db-sdk/ui/components/card'` |
| `Input` | Form input component | `import { Input } from '@db-sdk/ui/components/input'` |
| `Badge` | Small status indicator | `import { Badge } from '@db-sdk/ui/components/badge'` |

### Form Components

| Component | Description | Usage |
|-----------|-------------|-------|
| `Label` | Form label component | `import { Label } from '@db-sdk/ui/components/label'` |
| `Textarea` | Multi-line text input | `import { Textarea } from '@db-sdk/ui/components/textarea'` |
| `Select` | Dropdown selection | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@db-sdk/ui/components/select'` |

### Layout Components

| Component | Description | Usage |
|-----------|-------------|-------|
| `Separator` | Visual divider | `import { Separator } from '@db-sdk/ui/components/separator'` |
| `AspectRatio` | Maintain aspect ratio | `import { AspectRatio } from '@db-sdk/ui/components/aspect-ratio'` |

## 🔧 Adding New Components

### Using shadcn/ui CLI

```bash
# Navigate to UI package
cd packages/ui

# Add new component
pnpm ui:add button
pnpm ui:add card
pnpm ui:add input
pnpm ui:add dialog
pnpm ui:add dropdown-menu
```

### Manual Component Creation

1. Create component file in `src/components/`
2. Export from `src/components/index.ts`
3. Update package.json exports if needed

```tsx
// src/components/custom-component.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const customComponentVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CustomComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof customComponentVariants> {}

const CustomComponent = React.forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(customComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CustomComponent.displayName = "CustomComponent"

export { CustomComponent, customComponentVariants }
```

## 🎨 Styling

### Tailwind CSS Integration

The UI package uses Tailwind CSS for styling. Components are built with utility classes and CSS variables for theming:

```css
/* src/lib/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Utility Functions

```tsx
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 🔧 Configuration

### shadcn/ui Configuration

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/lib/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Package Exports

```json
// package.json
{
  "exports": {
    "./globals.css": "./src/lib/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": [
      "./src/components/*.tsx",
      "./src/components/*.ts"
    ],
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

## 📦 Dependencies

### Core Dependencies

- **React**: UI library
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging utility

### UI Dependencies

- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library

### Development Dependencies

- **TypeScript**: Type checking
- **ESLint**: Code linting

## 🚀 Development Workflow

### 1. Adding New Components

```bash
# Use shadcn/ui CLI
cd packages/ui
pnpm ui:add <component-name>

# Or manually create component
touch src/components/new-component.tsx
```

### 2. Testing Components

```tsx
// Test component in web app
import { NewComponent } from '@db-sdk/ui/components/new-component'

export default function TestPage() {
  return (
    <div className="p-4">
      <NewComponent>Test Content</NewComponent>
    </div>
  )
}
```

### 3. Publishing Updates

```bash
# Build the package
pnpm build --filter=@db-sdk/ui

# The changes are automatically available in the monorepo
```

## 🎯 Best Practices

### Component Design

1. **Use TypeScript**: All components should be fully typed
2. **Follow shadcn/ui patterns**: Use consistent naming and structure
3. **Support variants**: Use class-variance-authority for component variants
4. **Accessibility**: Ensure components are accessible with proper ARIA attributes
5. **Responsive**: Design components to work across different screen sizes

### Code Style

```tsx
// Good: Proper TypeScript and accessibility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

## 🔍 Troubleshooting

### Common Issues

**Component not found:**
```bash
# Rebuild the package
pnpm build --filter=@db-sdk/ui

# Clear node_modules and reinstall
pnpm clean
pnpm install
```

**Styling issues:**
```bash
# Ensure globals.css is imported
import '@db-sdk/ui/globals.css'
```

**TypeScript errors:**
```bash
# Check types
pnpm check-types --filter=@db-sdk/ui
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [class-variance-authority](https://cva.style/docs)
- [clsx Documentation](https://github.com/lukeed/clsx)

## 🤝 Contributing

1. Follow the established component patterns
2. Ensure components are accessible
3. Add proper TypeScript types
4. Test components in both web and mobile apps
5. Update documentation for new components

---

Built with ❤️ using shadcn/ui, Radix UI, and Tailwind CSS 