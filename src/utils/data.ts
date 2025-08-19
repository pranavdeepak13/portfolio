export interface CareerItem { year: string; title: string; summary: string; stack: string[] }
export interface ProjectItem { slug: string; title: string; subtitle: string; description: string; details?: string; tech: string[]; metrics?: string[]; links: { demo: string; repo: string } }
export interface SkillGroup { category: string; items: { name: string; level: number }[] }
export interface MiscItem { slug: string; title: string; subtitle: string; details: string; links?: { label: string; href: string }[] }
export interface HobbyItem { src: string; alt: string; title: string; blurb: string }

export const career: CareerItem[] = [
  { year: 'Jul 2025 - Present', title: 'Business Analyst · Flipkart', summary: 'Led metrics governance and recommendation analytics optimization during sale events, developing automated dashboards and implementing hyperlocal replenishment strategies that increased GMV by 20%', stack: ['Python','SQL','BigQuery','PySpark','R'] },
  { year: 'Jan 2024 - Jul 2024 ', title: 'SDE Intern · BNP Paribas ISPL', summary: 'Built ETL pipelines for financial data sources and handled source control migration from Visual Source Safe to Bitbucket.', stack: ['Bitbucket','Microsoft VSS','Shell Scripting','Informatica PowerCenter Suite'] },
  { year: 'Oct 2022 - Dec 2023', title: 'Research Intern · Sony SSUP', summary: 'Led integration team to enable microcontroller data accessibility on the cloud platform. Redesigned backend to microservices architecture and rebuilt the complete dashboard frontend', stack: ['GraphDB Ontotext','MQTT','MERN','InfluxDB'] },
  { year: 'Aug 2022 - Sep 2022', title: 'Application Development Intern · L&T Construction', summary: ' Developed backend Web APIs and built multiple web components for site evaluation client applications.', stack: ['ASP.NET Core','Angular','MS SQL','Postman'] },
  { year: 'Oct 2020 - Jul 2024', title: 'Undergraduate Student · Amrita Vishwa Vidyapeetham , Coimbatore', summary: 'Got my B.Tech in Computer Science and Engineering & found my passion for technology and design.', stack: ['Data Science','Full Stack Dev','Computer Networks'] }
]

export const projects: ProjectItem[] = [
  { 
    slug: 'amusify', 
    title: 'Amusify', 
    subtitle: 'Music Recommendation & Analytics App',
    description: 'Music recommendation dashboard with analytics built using Spotify API.',
    details: 'Content-based filtering algorithms with real-time music data integration.',
    tech: ['Python', 'Streamlit', 'Spotify API'], 
    metrics: ['Real-time recommendations', 'Content-based filtering'],
    links: { demo: '#', repo: 'https://github.com/pranavdeepak13/Amusify' } 
  },
  { 
    slug: 'facdash', 
    title: 'FacDash', 
    subtitle: 'Comprehensive Faculty Dashboard',
    description: 'Full-stack faculty management system with worklog tracking and scheduling.',
    details: 'Multi-role authentication system supporting Admin, Faculty, and Student profiles.',
    tech: ['ReactJS', 'NodeJS', 'ExpressJS', 'MySQL'], 
    metrics: ['JWT Authentication', 'API Gateway Security'],
    links: { demo: '#', repo: 'https://github.com/pranavdeepak13/FacultyDashboard' } 
  },
  { 
    slug: 'newsner', 
    title: 'NewsNER', 
    subtitle: 'Information Extraction & Classification Tool',
    description: 'NLP-powered information extraction tool fine-tuned for Hindi news articles.',
    details: 'Fine-tuned LLMs with robust NLP concepts for categorical classification.',
    tech: ['Python', 'NLTK', 'Spacy', 'HuggingFace'], 
    metrics: ['Fine-tuned LLMs', 'Regional dialect support'],
    links: { demo: '#', repo: 'https://github.com/pranavdeepak13/NewsNER' } 
  },
  { 
    slug: 'clustersense', 
    title: 'ClusterSense', 
    subtitle: 'Customer Segmentation Analysis',
    description: 'Customer segmentation analysis to identify key groups and tailor marketing strategies.',
    details: 'K-means clustering with comprehensive data visualization and insights.',
    tech: ['Python', 'R', 'scikit-learn', 'Pandas'], 
    metrics: ['K-means clustering', 'Marketing strategy insights'],
    links: { demo: '#', repo: '#' } 
  }
]

export const skills: SkillGroup[] = [
  { category: 'Frontend', items: [
      { name: 'React', level: 70 }, { name: 'TypeScript', level: 70 }, { name: 'Tailwind / CSS', level: 80 },
      { name: 'Framer Motion', level: 40 }
  ]},
  { category: 'Backend', items: [
      { name: 'Node / Express', level: 85 }, { name: 'MySQL', level: 80 }, { name: 'GraphQL', level: 60 },
      { name: 'tRPC / REST', level: 90 }, { name: 'Graph Databases', level: 70 }
  ]},
  { category: 'Data Science', items: [
      { name: 'Machine Learning', level: 75 }, { name: 'Data Analysis & Visualization', level: 80 },
      { name: 'Python Libraries', level: 80 }, { name: 'R', level: 70 }
  ]}
]

export const miscItems: MiscItem[] = [
  { 
    slug: 'research-paper', 
    title: 'Research Publication', 
    subtitle: 'Content-Agnostic Community Classification',
    details: 'Meta-graph representations of conversational dynamics for community classification (OSNEM 2025 - In peer-review).',
    links: [{ label: 'Preprint', href: '#' }] 
  },
  { 
    slug: 'hackathon-winner', 
    title: 'Hackathon', 
    subtitle: 'Flipkart AnalytiQ Hackathon 2025 - 3rd Prize',
    details: 'Built post-order RTO (Return to Origin) prediction system for e-commerce logistics optimization.',
    links: [{ label: 'Project', href: '#' }] 
  },
  { 
    slug: 'conf-paper', 
    title: 'Paper Presentation', 
    subtitle: 'Annual Flipkart DS Conference 2025',
    details: 'Presented weather-based recommender system and hyperlocal product replenishment strategies.',
    links: [{ label: 'Paper', href: '#' }] 
  },
  { 
    slug: 'certifications', 
    title: 'Certifications', 
    subtitle: 'Machine Learning & Deep Learning Specializations',
    details: 'Completed comprehensive Coursera specializations covering ML algorithms and deep learning architectures.',
    links: [{ label: 'ML Cert', href: '#' }, { label: 'DL Cert', href: '#' }] 
  }
]

export const hobbies: HobbyItem[] = [
  { 
    src: 'images/hobbies/piano.webp', 
    alt: 'Piano keys and sheet music', 
    title: 'Pianist', 
    blurb: 'My companion when I feel alone.' 
  },
  { 
    src: 'images/hobbies/badminton.webp', 
    alt: 'Badminton racket and shuttlecock', 
    title: 'Badminton', 
    blurb: 'Best sport for relaxation and focus, ngl.' 
  },
  { 
    src: 'images/hobbies/cinema.webp', 
    alt: 'Film reel and movie screen', 
    title: 'Cinephile', 
    blurb: 'Storytelling through visual narratives and cinematography catches my eye.' 
  },
  { 
    src: 'images/hobbies/swimming.webp', 
    alt: 'Swimming pool lanes', 
    title: 'Swimming',
    blurb: 'A refreshing escape.' 
  }
]
