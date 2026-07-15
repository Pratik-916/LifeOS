// __mocks__/lucide-react-native.js
// CJS-compatible mock for lucide-react-native (package ships ESM-only .mjs files)
const React = require('react');
const { View } = require('react-native');

const MockIcon = ({ testID, size, color, ...props }) =>
  React.createElement(View, { testID: testID || 'icon', ...props });

// Export commonly used icon names as named exports
const createIconMock = (name) => {
  const Icon = (props) => React.createElement(View, { testID: name, ...props });
  Icon.displayName = name;
  return Icon;
};

module.exports = {
  __esModule: true,
  // Generic Icon component
  Icon: MockIcon,
  // Commonly used icons in LifeOS
  Home: createIconMock('Home'),
  CheckCircle: createIconMock('CheckCircle'),
  Circle: createIconMock('Circle'),
  Plus: createIconMock('Plus'),
  Search: createIconMock('Search'),
  Settings: createIconMock('Settings'),
  User: createIconMock('User'),
  Calendar: createIconMock('Calendar'),
  Target: createIconMock('Target'),
  Book: createIconMock('Book'),
  BookOpen: createIconMock('BookOpen'),
  Map: createIconMock('Map'),
  BarChart2: createIconMock('BarChart2'),
  ChevronRight: createIconMock('ChevronRight'),
  ChevronLeft: createIconMock('ChevronLeft'),
  ChevronDown: createIconMock('ChevronDown'),
  ChevronUp: createIconMock('ChevronUp'),
  X: createIconMock('X'),
  Check: createIconMock('Check'),
  Edit: createIconMock('Edit'),
  Trash2: createIconMock('Trash2'),
  Star: createIconMock('Star'),
  Heart: createIconMock('Heart'),
  Bell: createIconMock('Bell'),
  Filter: createIconMock('Filter'),
  SortDesc: createIconMock('SortDesc'),
  ArrowLeft: createIconMock('ArrowLeft'),
  ArrowRight: createIconMock('ArrowRight'),
  Info: createIconMock('Info'),
  AlertCircle: createIconMock('AlertCircle'),
  AlertTriangle: createIconMock('AlertTriangle'),
  Eye: createIconMock('Eye'),
  EyeOff: createIconMock('EyeOff'),
  Lock: createIconMock('Lock'),
  Unlock: createIconMock('Unlock'),
  Flame: createIconMock('Flame'),
  Zap: createIconMock('Zap'),
  TrendingUp: createIconMock('TrendingUp'),
  TrendingDown: createIconMock('TrendingDown'),
  Activity: createIconMock('Activity'),
  Clock: createIconMock('Clock'),
  MapPin: createIconMock('MapPin'),
  Image: createIconMock('Image'),
  Camera: createIconMock('Camera'),
  Upload: createIconMock('Upload'),
  Download: createIconMock('Download'),
  Share: createIconMock('Share'),
  Share2: createIconMock('Share2'),
  RefreshCw: createIconMock('RefreshCw'),
  RotateCcw: createIconMock('RotateCcw'),
  LogOut: createIconMock('LogOut'),
  LogIn: createIconMock('LogIn'),
  Layout: createIconMock('Layout'),
  List: createIconMock('List'),
  Grid: createIconMock('Grid'),
  Menu: createIconMock('Menu'),
  MoreVertical: createIconMock('MoreVertical'),
  MoreHorizontal: createIconMock('MoreHorizontal'),
};
