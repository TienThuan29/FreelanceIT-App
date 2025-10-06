import { User, DeveloperProfile, Role, DeveloperLevel, SkillProficiency, Skill } from "@/models/user.model";
import { Commune, Province } from "@/models/address.model";

// Sample Vietnamese communes and provinces
const sampleCommunes: Commune[] = [
    {
        code: "001",
        name: "Ben Nghe Ward",
        englishName: "Ben Nghe Ward",
        administrativeLevel: "Ward",
        provinceCode: "79",
        provinceName: "Ho Chi Minh City",
        decree: "Decree 123"
    },
    {
        code: "002",
        name: "Da Kao Ward",
        englishName: "Da Kao Ward",
        administrativeLevel: "Ward",
        provinceCode: "79",
        provinceName: "Ho Chi Minh City",
        decree: "Decree 123"
    },
    {
        code: "003",
        name: "Ben Thanh Ward",
        englishName: "Ben Thanh Ward",
        administrativeLevel: "Ward",
        provinceCode: "79",
        provinceName: "Ho Chi Minh City",
        decree: "Decree 123"
    },
    {
        code: "004",
        name: "Cau Kho Ward",
        englishName: "Cau Kho Ward",
        administrativeLevel: "Ward",
        provinceCode: "79",
        provinceName: "Ho Chi Minh City",
        decree: "Decree 123"
    },
    {
        code: "005",
        name: "Cau Ong Lanh Ward",
        englishName: "Cau Ong Lanh Ward",
        administrativeLevel: "Ward",
        provinceCode: "79",
        provinceName: "Ho Chi Minh City",
        decree: "Decree 123"
    }
];

const sampleProvinces: Province[] = [
    {
        code: "79",
        name: "Ho Chi Minh City",
        englishName: "Ho Chi Minh City",
        administrativeLevel: "City",
        decree: "Decree 123"
    },
    {
        code: "01",
        name: "Hanoi",
        englishName: "Hanoi",
        administrativeLevel: "City",
        decree: "Decree 123"
    },
    {
        code: "48",
        name: "Da Nang",
        englishName: "Da Nang",
        administrativeLevel: "City",
        decree: "Decree 123"
    }
];

const firstNames = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi",
    "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Đào", "Mai", "Lưu", "Lương"
];

const lastNames = [
    "Văn An", "Thị Bình", "Minh Cường", "Thị Dung", "Văn Em", "Thị Phượng", "Minh Giang",
    "Thị Hương", "Văn Ích", "Thị Kỳ", "Minh Lâm", "Thị Mai", "Văn Nam", "Thị Oanh",
    "Minh Phúc", "Thị Quỳnh", "Văn Rồng", "Thị Sương", "Minh Tài", "Thị Uyên"
];

// English versions for email generation
const firstNamesEnglish = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Vo", "Dang", "Bui",
    "Do", "Ho", "Ngo", "Duong", "Ly", "Dinh", "Dao", "Mai", "Luu", "Luong"
];

const lastNamesEnglish = [
    "Van An", "Thi Binh", "Minh Cuong", "Thi Dung", "Van Em", "Thi Phuong", "Minh Giang",
    "Thi Huong", "Van Ich", "Thi Ky", "Minh Lam", "Thi Mai", "Van Nam", "Thi Oanh",
    "Minh Phuc", "Thi Quynh", "Van Rong", "Thi Suong", "Minh Tai", "Thi Uyen"
];

const skills = [
    { name: "JavaScript", proficiency: SkillProficiency.EXPERT, years: 5 },
    { name: "TypeScript", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "React", proficiency: SkillProficiency.EXPERT, years: 5 },
    { name: "Node.js", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "Python", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "Java", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "C#", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "PHP", proficiency: SkillProficiency.BEGINNER, years: 2 },
    { name: "Vue.js", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "Angular", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "MongoDB", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "PostgreSQL", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "MySQL", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "Redis", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "Docker", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "AWS", proficiency: SkillProficiency.INTERMEDIATE, years: 3 },
    { name: "Kubernetes", proficiency: SkillProficiency.BEGINNER, years: 2 },
    { name: "Git", proficiency: SkillProficiency.EXPERT, years: 6 },
    { name: "GraphQL", proficiency: SkillProficiency.ADVANCED, years: 4 },
    { name: "REST API", proficiency: SkillProficiency.EXPERT, years: 5 }
];

const titles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer",
    "DevOps Engineer", "UI/UX Developer", "Blockchain Developer", "Game Developer",
    "Data Scientist", "Machine Learning Engineer", "Cloud Engineer", "System Administrator"
];

const bios = [
    "Passionate developer with a love for clean code and innovative solutions.",
    "Experienced software engineer specializing in modern web technologies.",
    "Full-stack developer with expertise in building scalable applications.",
    "Mobile app developer focused on creating exceptional user experiences.",
    "DevOps enthusiast with a passion for automation and infrastructure.",
    "UI/UX developer who bridges the gap between design and functionality.",
    "Blockchain developer exploring the future of decentralized applications.",
    "Game developer with a creative approach to interactive experiences.",
    "Data scientist passionate about turning data into actionable insights.",
    "Machine learning engineer focused on AI-powered solutions.",
    "Cloud engineer specializing in scalable and secure infrastructure.",
    "System administrator with expertise in maintaining robust systems."
];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateRandomEmail(fullname: string): string {
    const cleanName = fullname.toLowerCase().replace(/\s+/g, '');
    const domains = ["gmail.com"];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${cleanName}${numbers}@${getRandomElement(domains)}`;
}

function generateRandomPhone(): string {
    const prefixes = ["090", "091", "092", "093", "094", "095", "096", "097", "098", "099"];
    const prefix = getRandomElement(prefixes);
    const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${prefix}${number}`;
}

function generateRandomSkills(): Skill[] {
    const skillCount = Math.floor(Math.random() * 8) + 3; // 3-10 skills
    const selectedSkills = getRandomElements(skills, skillCount);
    
    return selectedSkills.map((skill, index) => ({
        id: `skill_${Date.now()}_${index}`,
        name: skill.name,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.years + Math.floor(Math.random() * 3) - 1 // ±1 year variation
    }));
}

function generateRandomDateOfBirth(): Date {
    const year = 1985 + Math.floor(Math.random() * 25); // Born between 1985-2010
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    return new Date(year, month, day);
}

export function generateDeveloperData(): { user: User, developerProfile: DeveloperProfile } {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const fullname = `${firstName} ${lastName}`;
    
    // Use English names for email generation
    const firstNameEnglish = getRandomElement(firstNamesEnglish);
    const lastNameEnglish = getRandomElement(lastNamesEnglish);
    const fullnameEnglish = `${firstNameEnglish} ${lastNameEnglish}`;
    
    const email = generateRandomEmail(fullnameEnglish);
    const phone = generateRandomPhone();
    const dateOfBirth = generateRandomDateOfBirth();
    const commune = getRandomElement(sampleCommunes);
    const province = getRandomElement(sampleProvinces);
    
    const experienceYears = Math.floor(Math.random() * 10) + 1; // 1-10 years
    const hourlyRate = 100000 + Math.floor(Math.random() * 100000); // 100,000-200,000 VND/hour
    
    // Calculate developer level based on experience
    let developerLevel: DeveloperLevel;
    if (experienceYears <= 2) {
        developerLevel = DeveloperLevel.JUNIOR;
    } else if (experienceYears <= 4) {
        developerLevel = DeveloperLevel.MID;
    } else if (experienceYears <= 7) {
        developerLevel = DeveloperLevel.SENIOR;
    } else {
        developerLevel = DeveloperLevel.LEAD;
    }
    
    const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0 rating
    const totalProjects = Math.floor(Math.random() * 50) + 1; // 1-50 projects
    
    const user: User = {
        id: "", // Will be set by the repository
        email: email,
        password: "12345", // Default password
        fullname: fullname,
        phone: phone,
        dateOfBirth: dateOfBirth,
        role: Role.DEVELOPER,
        isEnable: true,
        commune: commune,
        province: province,
        createdDate: new Date(),
        updatedDate: new Date()
    };
    
    const developerProfile: DeveloperProfile = {
        userId: "", // Will be set after user creation
        title: getRandomElement(titles),
        bio: getRandomElement(bios),
        hourlyRate: hourlyRate,
        experienceYears: experienceYears,
        developerLevel: developerLevel,
        githubUrl: `https://github.com/${fullnameEnglish.toLowerCase().replace(/\s+/g, '')}`,
        linkedinUrl: `https://linkedin.com/in/${fullnameEnglish.toLowerCase().replace(/\s+/g, '')}`,
        isAvailable: Math.random() > 0.3, // 70% available
        rating: Math.round(rating * 10) / 10,
        skills: generateRandomSkills(),
        totalProjects: totalProjects,
        languages: ["Vietnamese", "English"],
        timezone: "Asia/Ho_Chi_Minh",
        cvUrl: `https://example.com/cv/${fullnameEnglish.toLowerCase().replace(/\s+/g, '')}.pdf`
    };
    
    return { user, developerProfile };
}

export function generateMultipleDevelopers(count: number = 20): { user: User, developerProfile: DeveloperProfile }[] {
    const developers = [];
    for (let i = 0; i < count; i++) {
        developers.push(generateDeveloperData());
    }
    return developers;
}
