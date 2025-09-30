import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const Education = () => {
  const { t } = useTranslation()
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const articles = [
    {
      id: 1,
      title: 'Understanding Air Quality Index (AQI)',
      excerpt: 'Learn what AQI means and how it affects your health',
      category: 'Basics',
      readTime: '5 min read',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Health Effects of Air Pollution',
      excerpt: 'Discover how different pollutants impact your respiratory and cardiovascular health',
      category: 'Health',
      readTime: '8 min read',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Protecting Yourself from Poor Air Quality',
      excerpt: 'Practical tips to reduce exposure to air pollution',
      category: 'Prevention',
      readTime: '6 min read',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Indoor Air Quality: What You Need to Know',
      excerpt: 'How to maintain clean air inside your home and workplace',
      category: 'Indoor Air',
      readTime: '7 min read',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'Air Pollution and Children\'s Health',
      excerpt: 'Special considerations for protecting children from air pollution',
      category: 'Children',
      readTime: '9 min read',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'Seasonal Air Quality Patterns in India',
      excerpt: 'Understanding how air quality changes throughout the year',
      category: 'Seasonal',
      readTime: '10 min read',
      image: '/api/placeholder/300/200'
    }
  ]

  const videos = [
    {
      id: 1,
      title: 'What is Air Pollution?',
      duration: '3:45',
      thumbnail: '/api/placeholder/300/200',
      description: 'A simple explanation of air pollution and its sources'
    },
    {
      id: 2,
      title: 'How to Read AQI Values',
      duration: '2:30',
      thumbnail: '/api/placeholder/300/200',
      description: 'Understanding AQI colors and what they mean for your health'
    },
    {
      id: 3,
      title: 'Air Purifiers: Do They Work?',
      duration: '5:20',
      thumbnail: '/api/placeholder/300/200',
      description: 'Evaluating the effectiveness of different air purification methods'
    },
    {
      id: 4,
      title: 'Breathing Exercises for Polluted Air',
      duration: '4:15',
      thumbnail: '/api/placeholder/300/200',
      description: 'Techniques to improve lung health in polluted environments'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'What is a safe AQI level?',
      answer: 'AQI levels between 0-50 are considered good and safe for everyone. Levels between 51-100 are moderate and acceptable for most people. Above 100, sensitive individuals should start taking precautions.'
    },
    {
      id: 2,
      question: 'How often should I check air quality?',
      answer: 'It\'s recommended to check air quality daily, especially if you have respiratory conditions, are elderly, or have young children. Check before outdoor activities and exercise.'
    },
    {
      id: 3,
      question: 'What are the main sources of air pollution in Indian cities?',
      answer: 'Major sources include vehicle emissions, industrial activities, construction dust, crop burning, power plants, and domestic cooking with solid fuels.'
    },
    {
      id: 4,
      question: 'Do masks really help against air pollution?',
      answer: 'Yes, properly fitted N95 or N99 masks can filter out fine particles (PM2.5). However, they don\'t protect against gases like ozone or nitrogen dioxide.'
    },
    {
      id: 5,
      question: 'How does air pollution affect children differently?',
      answer: 'Children are more vulnerable because they breathe faster, spend more time outdoors, and their lungs are still developing. They may experience more respiratory infections and reduced lung function.'
    },
    {
      id: 6,
      question: 'Can indoor plants improve air quality?',
      answer: 'While some plants can remove certain pollutants, they\'re not effective enough to significantly improve indoor air quality. Proper ventilation and air purifiers are more effective.'
    },
    {
      id: 7,
      question: 'What should I do during high pollution days?',
      answer: 'Stay indoors, keep windows closed, use air purifiers, avoid outdoor exercise, wear masks if you must go out, and stay hydrated.'
    },
    {
      id: 8,
      question: 'How is AQI calculated?',
      answer: 'AQI is calculated based on concentrations of major pollutants: PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide. The highest individual pollutant AQI becomes the overall AQI.'
    }
  ]

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen page-education">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('nav.education')}
          </h1>
          <p className="text-gray-600">
            Learn about air quality, health impacts, and protection strategies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Articles & Guides</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <img 
                    src={`https://picsum.photos/300/200?random=${article.id}`}
                    alt={article.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt}
                    </p>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <span>Read More</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Play className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Educational Videos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="relative h-40 rounded-t-lg overflow-hidden cursor-pointer group">
                    <img 
                      src={`https://picsum.photos/300/200?random=${video.id + 10}`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <Play className="text-white ml-1" size={20} fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-lg shadow">
              {faqs.map((faq, index) => (
                <div key={faq.id} className={`${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="text-gray-500" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-500" size={20} />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Health Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center" 
                    alt="Stay Hydrated" 
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">Stay Hydrated</h3>
                  <p className="text-sm text-gray-600">Drink plenty of water to help your body flush out toxins</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center" 
                    alt="Exercise Indoors" 
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">Exercise Indoors</h3>
                  <p className="text-sm text-gray-600">On high pollution days, move your workout indoors</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center" 
                    alt="Wear Masks" 
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">Wear Masks</h3>
                  <p className="text-sm text-gray-600">Use N95 masks when AQI is above 100</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center" 
                    alt="Clean Indoor Air" 
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">Clean Indoor Air</h3>
                  <p className="text-sm text-gray-600">Use air purifiers and keep windows closed during high pollution</p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Educational Videos Library
            </h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Featured Documentary</h3>
                  <div className="relative rounded-lg overflow-hidden cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=300&fit=crop" 
                      alt="Air Pollution Documentary" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <Play className="text-white ml-1" size={24} fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">The Hidden Cost of Air Pollution</h4>
                      <p className="text-sm opacity-90">45 minutes • Documentary</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Learning Videos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=80&h=60&fit=crop" 
                        alt="Video thumbnail" 
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">5 Ways to Protect Your Family</h4>
                        <p className="text-xs text-gray-500">3:20 • 12K views</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=60&fit=crop" 
                        alt="Video thumbnail" 
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Understanding PM2.5 vs PM10</h4>
                        <p className="text-xs text-gray-500">2:45 • 8.5K views</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=60&fit=crop" 
                        alt="Video thumbnail" 
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Best Air Purifying Plants</h4>
                        <p className="text-xs text-gray-500">4:10 • 15K views</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop" 
                        alt="Video thumbnail" 
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Breathing Techniques for Clean Air</h4>
                        <p className="text-xs text-gray-500">6:30 • 9.2K views</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Education