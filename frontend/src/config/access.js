export const ACCESS_PROFILES = {
  ADMIN: {
    label: 'Administrator',
    summary:
      'Full platform control: manage users, academics, fees, marks, timetable, reports, and access rules.',
    views: [
      'overview',
      'students',
      'professors',
      'courses',
      'academic',
      'fees',
      'marks',
      'timetable',
      'reports',
      'access',
    ],
    permissions: [
      'Create, edit, and delete all records',
      'Create staff accounts and manage all access levels',
      'View and manage all departments, semesters, courses, and syllabi',
      'Manage fees, marks, timetables, and admin reports',
      'Full visibility across university-wide data',
    ],
  },
  REGISTRAR: {
    label: 'Registrar',
    summary:
      'Academic operations role: manage student lifecycle, curriculum structure, fees, and reporting.',
    views: ['overview', 'students', 'courses', 'academic', 'fees', 'reports', 'access'],
    permissions: [
      'Create, edit, and delete students and courses',
      'Manage departments, semesters, classes, and syllabi',
      'Manage fee records and payment status',
      'View operational reports',
      'No professor account administration',
    ],
  },
  PROFESSOR: {
    label: 'Professor',
    summary:
      'Teaching role: review students, manage marks, and work with timetable and assigned courses.',
    views: ['overview', 'courses', 'students', 'marks', 'timetable', 'reports', 'access'],
    permissions: [
      'View students and course catalog',
      'Create and update marks/results',
      'View and manage timetable entries',
      'View teaching-focused reports',
      'No access to fee administration or user management',
    ],
  },
  STUDENT: {
    label: 'Student',
    summary:
      'Learner self-service role: access own academic and fee information with course and timetable view.',
    views: ['overview', 'courses', 'fees', 'marks', 'timetable', 'access'],
    permissions: [
      'Register and sign in to personal account',
      'View own fee records and payment status',
      'View own marks, grade, and pass/fail result',
      'View published courses and timetable',
      'No edit rights for academic master data',
    ],
  },
};

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', path: '/overview' },
  { id: 'students', label: 'Students', path: '/students' },
  { id: 'professors', label: 'Professors', path: '/professors' },
  { id: 'courses', label: 'Courses', path: '/courses' },
  { id: 'academic', label: 'Academic', path: '/academic' },
  { id: 'fees', label: 'Fees', path: '/fees' },
  { id: 'marks', label: 'Marks', path: '/marks' },
  { id: 'timetable', label: 'Timetable', path: '/timetable' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'access', label: 'Access', path: '/access' },
];

export function getProfile(accessLevel) {
  return ACCESS_PROFILES[accessLevel] || ACCESS_PROFILES.STUDENT;
}

export function getDefaultPath(accessLevel) {
  const profile = getProfile(accessLevel);
  const firstView = profile.views[0] || 'overview';
  return getPathForView(firstView);
}

export function getPathForView(viewId) {
  const item = NAV_ITEMS.find((navItem) => navItem.id === viewId);
  return item ? item.path : '/overview';
}

export function getViewForPath(pathname) {
  const item = NAV_ITEMS.find((navItem) => navItem.path === pathname);
  return item ? item.id : '';
}

export function canAccessView(accessLevel, viewId) {
  return getProfile(accessLevel).views.includes(viewId);
}

export const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    accessLevel: 'ADMIN',
    email: 'admin@university.edu',
    password: 'admin123',
  },
  {
    label: 'Registrar',
    accessLevel: 'REGISTRAR',
    email: 'registrar@university.edu',
    password: 'registrar123',
  },
  {
    label: 'Professor',
    accessLevel: 'PROFESSOR',
    email: 'professor@university.edu',
    password: 'professor123',
  },
  {
    label: 'Student',
    accessLevel: 'STUDENT',
    email: 'student@university.edu',
    password: 'student123',
  },
];
