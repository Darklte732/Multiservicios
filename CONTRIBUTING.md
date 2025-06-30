# Contributing to MultiServicios El Seibo

Thank you for your interest in contributing to MultiServicios! This document provides guidelines for contributing to our electrical services web application.

## 🚀 Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Open browser**: Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── app/            # Next.js 15 app router pages
├── components/     # Reusable UI components
├── lib/           # Utilities and configurations
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```

## 🎯 Development Guidelines

### Code Style
- Use **TypeScript** for all new files
- Follow **ESLint** and **Prettier** configurations
- Use **Tailwind CSS** for styling
- Maintain **Spanish localization** (es-DO locale)

### Components
- Use **'use client'** directive for interactive components
- Follow the existing component structure
- Include proper TypeScript interfaces
- Use semantic HTML elements

### Styling
- **Mobile-first** responsive design
- Use Tailwind CSS utility classes
- Follow the established color scheme:
  - Primary Blue: `#3b82f6`
  - Success Green: `#10b981`
  - Warning Orange: `#f59e0b`
  - Emergency Red: `#ef4444`
  - Purple Accent: `#8b5cf6`

### Spanish Content
- All user-facing text must be in **Dominican Spanish**
- Use **es-DO** locale for dates and currency
- Currency format: **RD$ (Dominican Peso)**
- Phone numbers: **Dominican format** (+1 809 xxx-xxxx)

## 🔧 Technical Requirements

### Dependencies
- **Next.js 15.3.4** with App Router
- **TypeScript 5.x** for type safety
- **Tailwind CSS 4.1.11** for styling
- **Supabase 2.50.2** for backend
- **Zustand 5.0.6** for state management
- **Lucide React** for icons

### Browser Support
- **Modern browsers** (Chrome 90+, Firefox 88+, Safari 14+)
- **Mobile responsive** design
- **Touch-friendly** interfaces

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): brief description

Detailed description if necessary

- List any breaking changes
- Reference issue numbers: #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes bug nor adds feature
- `test`: Adding missing tests
- `chore`: Maintain, build tools, etc.

### Examples
```bash
feat(booking): add calendar date selection
fix(dashboard): resolve earnings calculation bug
docs(readme): update installation instructions
style(components): format with prettier
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Browser/device** information
6. **Console errors** if any

## 🚀 Feature Requests

For new features:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider Dominican market** requirements
5. **Propose implementation** if possible

## 🧪 Testing

### Before Submitting
- [ ] Code builds without errors: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] ESLint passes: `npm run lint`
- [ ] All pages load correctly
- [ ] Spanish localization is maintained
- [ ] Mobile responsiveness works
- [ ] Booking flow functions properly
- [ ] Dashboard displays correctly

### Manual Testing Checklist
- [ ] **Homepage**: Navigation, service cards, WhatsApp contact
- [ ] **Booking**: Calendar selection, form validation, submission
- [ ] **Dashboard**: Job management, tabs, action buttons
- [ ] **Responsive**: Mobile, tablet, desktop layouts
- [ ] **Spanish**: All text in proper Dominican Spanish

## 🔐 Security

- **Never commit** sensitive data (API keys, passwords)
- Use **environment variables** for configuration
- Follow **secure coding practices**
- Report security issues privately

## 📞 Business Context

### Target Market
- **Dominican Republic** electrical services
- **El Seibo** region focus
- **Spanish-speaking** customers and technicians
- **Mobile-first** user base

### Service Types
- **Reparación**: Electrical repairs
- **Instalación**: New installations  
- **Mantenimiento**: Preventive maintenance
- **Emergencia**: 24/7 emergency services

### Pricing
- **Dominican Pesos (RD$)** currency
- **Transparent pricing** strategy
- **Emergency premium** rates
- **Competitive local market** rates

## 📞 Contact

For questions or support:
- **WhatsApp**: +1 (809) 555-0123
- **Email**: dev@multiservicios.app
- **Issues**: Use GitHub Issues for bugs and features

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for helping improve MultiServicios El Seibo! 🔌⚡ 