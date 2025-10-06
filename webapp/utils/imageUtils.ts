// Import các hình ảnh có sẵn
import { realWorldImages, imageUrls } from './realImages'

// Static asset paths for Next.js
const logoImage = '/assets/logo.png'
const iconImage = '/assets/icon.png'

/**
 * Utility functions để tạo và quản lý hình ảnh
 */

/**
 * Tạo avatar từ tên người dùng với màu sắc đẹp
 */
export const generateAvatar = (name: string, backgroundColor?: string, textColor?: string): string => {
  // Kiểm tra xem có avatar thực tế không
  if (realWorldImages.developers[name as keyof typeof realWorldImages.developers]) {
    return realWorldImages.developers[name as keyof typeof realWorldImages.developers]
  }

  const bg = backgroundColor || generateDeterministicColor(name)
  const color = textColor || 'ffffff'
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=${color}&size=150&font-size=0.6`
}

/**
 * Tạo màu ngẫu nhiên đẹp mắt
 */
export const generateRandomColor = (): string => {
  const colors = [
    '3B82F6', // Blue
    '059669', // Green
    'F59E0B', // Yellow
    'DC2626', // Red
    '7C3AED', // Purple
    'EC4899', // Pink
    '06B6D4', // Cyan
    '84CC16', // Lime
    'F97316', // Orange
    '8B5CF6', // Violet
    '10B981', // Emerald
    'EF4444', // Red
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Tạo màu deterministic dựa trên tên để tránh hydration mismatch
 */
export const generateDeterministicColor = (name: string): string => {
  const colors = [
    '3B82F6', // Blue
    '059669', // Green
    'F59E0B', // Yellow
    'DC2626', // Red
    '7C3AED', // Purple
    'EC4899', // Pink
    '06B6D4', // Cyan
    '84CC16', // Lime
    'F97316', // Orange
    '8B5CF6', // Violet
    '10B981', // Emerald
    'EF4444', // Red
  ]
  
  // Tạo hash từ tên để có màu consistent
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Đảm bảo hash là số dương và lấy modulo với số lượng màu
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Tạo hình ảnh sản phẩm với text và màu sắc
 */
export const generateProductImage = (
  text: string, 
  width: number = 800, 
  height: number = 600,
  backgroundColor?: string
): string => {
  // Kiểm tra xem có screenshot thực tế không
  if (realWorldImages.productScreenshots[text as keyof typeof realWorldImages.productScreenshots]) {
    return realWorldImages.productScreenshots[text as keyof typeof realWorldImages.productScreenshots]
  }

  const bg = backgroundColor || generateDeterministicColor(text)
  return `https://via.placeholder.com/${width}x${height}/${bg}/ffffff?text=${encodeURIComponent(text)}`
}

/**
 * Tạo logo công ty
 */
export const generateCompanyLogo = (companyName: string, backgroundColor?: string): string => {
  // Kiểm tra xem có logo thực tế không
  if (realWorldImages.companies[companyName as keyof typeof realWorldImages.companies]) {
    return realWorldImages.companies[companyName as keyof typeof realWorldImages.companies]
  }

  const bg = backgroundColor || generateDeterministicColor(companyName)
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=ffffff&size=150&font-size=0.6&rounded=true`
}

/**
 * Placeholder images cho các loại sản phẩm khác nhau
 */
export const productImages = {
  ecommerce: [
    generateProductImage('E-commerce Homepage', 800, 600, '4F46E5'),
    generateProductImage('Product Catalog', 800, 600, '059669'),
    generateProductImage('Shopping Cart', 800, 600, 'DC2626'),
    generateProductImage('Checkout Page', 800, 600, '7C3AED'),
    generateProductImage('User Dashboard', 800, 600, 'F59E0B'),
  ],
  webapp: [
    generateProductImage('Dashboard', 800, 600, '3B82F6'),
    generateProductImage('Analytics', 800, 600, '10B981'),
    generateProductImage('User Management', 800, 600, 'F59E0B'),
    generateProductImage('Settings', 800, 600, '8B5CF6'),
  ],
  mobile: [
    generateProductImage('Mobile Home', 400, 800, '06B6D4'),
    generateProductImage('Profile Screen', 400, 800, '84CC16'),
    generateProductImage('Chat Interface', 400, 800, 'F97316'),
    generateProductImage('Settings', 400, 800, 'EC4899'),
  ],
  api: [
    generateProductImage('API Documentation', 800, 600, '059669'),
    generateProductImage('Swagger UI', 800, 600, '3B82F6'),
    generateProductImage('Monitoring Dashboard', 800, 600, 'DC2626'),
  ]
}

/**
 * Hình ảnh mặc định cho các use case khác nhau
 */
export const defaultImages = {
  userAvatar: (name: string) => generateAvatar(name),
  companyLogo: (companyName: string) => generateCompanyLogo(companyName),
  productImage: (productName: string) => generateProductImage(productName),
  placeholder: (width: number = 300, height: number = 200, text: string = 'Image') => 
    generateProductImage(text, width, height, '6B7280'),
}

/**
 * Assets có sẵn
 */
export const assets = {
  logo: logoImage,
  icon: iconImage,
}

/**
 * Hình ảnh cho các category sản phẩm
 */
export const categoryImages = {
  'website': generateProductImage('Website Template', 800, 600, '3B82F6'),
  'mobile': generateProductImage('Mobile App', 400, 800, '10B981'),
  'template': generateProductImage('UI Template', 800, 600, '7C3AED'),
  'software': generateProductImage('Software Tool', 800, 600, 'F59E0B'),
  'api': generateProductImage('API Service', 800, 600, '059669'),
  'database': generateProductImage('Database Schema', 800, 600, 'DC2626'),
}

/**
 * Hình ảnh demo cho tech stack
 */
export const techStackImages = {
  'React': generateProductImage('React App', 800, 600, '61DAFB'),
  'Vue.js': generateProductImage('Vue Application', 800, 600, '4FC08D'),
  'Angular': generateProductImage('Angular App', 800, 600, 'DD0031'),
  'Node.js': generateProductImage('Node.js Backend', 800, 600, '339933'),
  'Python': generateProductImage('Python Application', 800, 600, '3776AB'),
  'Java': generateProductImage('Java Application', 800, 600, 'ED8B00'),
  'PHP': generateProductImage('PHP Application', 800, 600, '777BB4'),
  'Laravel': generateProductImage('Laravel App', 800, 600, 'FF2D20'),
  'Next.js': generateProductImage('Next.js App', 800, 600, '000000'),
  'Flutter': generateProductImage('Flutter App', 400, 800, '02569B'),
  'React Native': generateProductImage('React Native App', 400, 800, '61DAFB'),
}

/**
 * Sample avatars cho testing
 */
export const sampleAvatars = [
  generateAvatar('Nguyễn Văn Minh', '3B82F6'),
  generateAvatar('Trần Thị Lan', 'EC4899'),
  generateAvatar('Lê Văn Đức', '7C3AED'),
  generateAvatar('Phạm Thị Mai', 'F59E0B'),
  generateAvatar('Hoàng Văn Nam', '059669'),
  generateAvatar('Đặng Thị Hoa', 'DC2626'),
  generateAvatar('Vũ Văn Tùng', '06B6D4'),
  generateAvatar('Bùi Thị Nga', '84CC16'),
]

/**
 * Sample company logos
 */
export const sampleCompanyLogos = [
  generateCompanyLogo('TechViet Solutions', '3B82F6'),
  generateCompanyLogo('Digital Innovation', '059669'),
  generateCompanyLogo('Smart Hub', 'F59E0B'),
  generateCompanyLogo('Elite Tech', '7C3AED'),
  generateCompanyLogo('Green Tech', '10B981'),
  generateCompanyLogo('Blue Ocean', '06B6D4'),
  generateCompanyLogo('Red Dragon', 'DC2626'),
  generateCompanyLogo('Purple Rain', '8B5CF6'),
]

export default {
  generateAvatar,
  generateProductImage,
  generateCompanyLogo,
  generateRandomColor,
  generateDeterministicColor,
  productImages,
  defaultImages,
  assets,
  categoryImages,
  techStackImages,
  sampleAvatars,
  sampleCompanyLogos,
}
