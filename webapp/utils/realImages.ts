/**
 * Script để tải xuống hình ảnh thực tế từ Unsplash và các nguồn miễn phí khác
 * Chạy script này để tự động tải hình ảnh vào thư mục assets
 */

/**
 * Danh sách URL hình ảnh mẫu từ Unsplash (miễn phí)
 */
export const imageUrls = {
  // Avatar mẫu - Professional headshots
  avatars: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b2139a4c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
  ],

  // Logo công ty - Abstract và minimalist
  companyLogos: [
    'https://images.unsplash.com/photo-1621042346843-7cf3c9e15dd8?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1620288627223-53302f4e8566?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1621503751489-3b3f1e3ee4f1?w=150&h=150&fit=crop',
  ],

  // Hình ảnh sản phẩm - Technology và UI/UX
  products: {
    ecommerce: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&h=600&fit=crop',
    ],
    webapp: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop',
    ],
    mobile: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580987333330-658bebe4a1b1?w=400&h=800&fit=crop',
    ],
    api: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
    ]
  },

  // Tech stack illustrations
  techStack: {
    react: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    nodejs: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
    python: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
    javascript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
    typescript: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&h=600&fit=crop',
  },

  // Background images
  backgrounds: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
  ]
}

/**
 * Hàm để tạo URL proxy cho Unsplash images (tránh CORS)
 */
export const getProxiedImageUrl = (unsplashUrl: string): string => {
  // Sử dụng service proxy như cloudinary hoặc imagekit nếu cần
  return unsplashUrl
}

/**
 * Hàm để tạo placeholder với thông tin thực tế
 */
export const createRealisticPlaceholder = (
  text: string,
  width: number = 800,
  height: number = 600,
  bg: string = '6366f1',
  color: string = 'ffffff'
): string => {
  return `https://via.placeholder.com/${width}x${height}/${bg}/${color}?text=${encodeURIComponent(text)}`
}

/**
 * Mapping cho real-world images
 */
export const realWorldImages = {
  // Developer avatars với tên thật
  developers: {
    'Nguyễn Văn Minh': imageUrls.avatars[0],
    'Trần Thị Lan': imageUrls.avatars[1],
    'Lê Văn Đức': imageUrls.avatars[2],
    'Phạm Thị Mai': imageUrls.avatars[3],
    'Hoàng Văn Nam': imageUrls.avatars[4],
    'Đặng Thị Hoa': imageUrls.avatars[5],
  },

  // Company logos với tên thật
  companies: {
    'TechViet Solutions': imageUrls.companyLogos[0],
    'Digital Innovation': imageUrls.companyLogos[1],
    'Smart Hub': imageUrls.companyLogos[2],
    'Elite Tech': imageUrls.companyLogos[3],
  },

  // Product screenshots thực tế
  productScreenshots: {
    'E-commerce Platform': imageUrls.products.ecommerce[0],
    'Task Management System': imageUrls.products.webapp[0],
    'Mobile Finance App': imageUrls.products.mobile[0],
    'API Gateway': imageUrls.products.api[0],
  }
}

export default {
  imageUrls,
  realWorldImages,
  getProxiedImageUrl,
  createRealisticPlaceholder
}
