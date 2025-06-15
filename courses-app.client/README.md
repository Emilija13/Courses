# EduManage - Course Management System

A modern course management system built with Vite, React, and TypeScript, inspired by platforms like Moodle.

## Features

### 🎓 **Role-Based Access**
- **Administrator (Teacher)** dashboard with full course management
- **Student** dashboard with course enrollment and file access
- Secure login with role selection

### 👨‍🏫 **Administrator Features**
- Create and manage courses
- Enroll students in courses
- Upload and manage course files
- View course statistics and enrollment data

### 👨‍🎓 **Student Features**
- View enrolled courses
- Track course progress
- Access and download course materials
- Clean, intuitive interface

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd course-management-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── AdminDashboard.tsx  # Admin interface
│   ├── StudentDashboard.tsx # Student interface
│   ├── CourseCreation.tsx  # Course creation form
│   ├── CourseList.tsx      # Course display component
│   ├── UserEnrollment.tsx  # Student enrollment management
│   └── FileUpload.tsx      # File management system
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
\`\`\`

## Usage

### Login
- Enter any username and password
- Select your role (Administrator or Student)
- Click "Sign In"

### Administrator Functions
1. **Course Management**: View all courses with enrollment statistics
2. **Create Course**: Add new courses with categories and difficulty levels
3. **Enroll Students**: Assign students to specific courses
4. **File Management**: Upload course materials and resources

### Student Functions
1. **My Courses**: View enrolled courses with progress tracking
2. **Course Materials**: Access and download files for each course
3. **Progress Tracking**: Visual progress indicators for course completion

## Customization

### Styling
- Modify `tailwind.config.js` for custom design tokens
- Update `src/index.css` for global styles
- Components use Tailwind classes for easy customization

### Adding Features
- Components are modular and reusable
- Add new features by creating components in `src/components/`
- Use the existing UI component library for consistency

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Moodle and other learning management systems
- Built with modern React patterns and best practices
- UI components powered by Radix UI and shadcn/ui
