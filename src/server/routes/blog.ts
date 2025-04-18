import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { OpenAI } from 'openai';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get all blog posts
router.get('/posts', async (req, res) => {
  try {
    // For development, return mock data
    const mockPosts = [
      {
        id: '1',
        title: 'Top 10 Hidden Beaches in Southeast Asia',
        excerpt: 'Discover secluded paradises away from the tourist crowds.',
        content: `
          <p>Southeast Asia is home to some of the world's most beautiful beaches, but many travelers only visit the well-known spots. In this article, we'll take you off the beaten path to discover hidden gems that offer pristine sands, crystal-clear waters, and a peaceful atmosphere away from the crowds.</p>
          
          <h2>1. Koh Rong Samloem, Cambodia</h2>
          <p>This island paradise features powdery white sand beaches and turquoise waters. The lack of roads and limited development means you'll experience true tranquility here.</p>
          
          <h2>2. Nacpan Beach, Philippines</h2>
          <p>Located in El Nido, this four-kilometer stretch of golden sand is far less crowded than other beaches in the area. The gentle waves make it perfect for swimming.</p>
          
          <h2>3. Koh Kradan, Thailand</h2>
          <p>This small island in the Andaman Sea offers some of Thailand's most beautiful coral reefs, perfect for snorkeling right off the beach.</p>
          
          <p>The best time to visit these hidden beaches is during the dry season (November to April), when you'll experience less rainfall and calmer seas. Remember to respect these pristine environments by taking all trash with you and avoiding damage to coral reefs.</p>
          
          <p>For the adventurous traveler willing to venture beyond the typical tourist path, these hidden beaches offer rewards of unspoiled beauty and authentic local experiences.</p>
        `,
        author: {
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        date: new Date('2024-02-15'),
        category: 'Destinations',
        tags: ['beaches', 'southeast asia', 'hidden gems', 'travel tips'],
        image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80&w=2000',
        readTime: 8,
        likes: 342,
        comments: 47,
        trending: true,
      },
      {
        id: '2',
        title: 'How to Travel Sustainably in 2024',
        excerpt: 'Practical tips for reducing your carbon footprint while exploring the world.',
        content: `
          <p>Sustainable travel is no longer just a trend—it's becoming a necessity as we face climate challenges. Here are practical ways to make your travels more environmentally friendly without sacrificing experiences.</p>
          
          <h2>Choose Eco-Friendly Transportation</h2>
          <p>When possible, opt for trains over planes for shorter distances. If flying is necessary, choose direct flights to reduce emissions and consider airlines with carbon offset programs.</p>
          
          <h2>Stay in Sustainable Accommodations</h2>
          <p>Look for hotels and hostels with green certifications. Many properties now use renewable energy, have water conservation systems, and implement waste reduction programs.</p>
          
          <h2>Support Local Communities</h2>
          <p>Eat at locally-owned restaurants, shop at local markets, and hire local guides. This ensures your tourism dollars benefit the communities you're visiting.</p>
          
          <p>Remember that sustainable travel isn't about perfection—it's about making better choices when possible. Even small changes in how we travel can collectively make a significant positive impact on our planet.</p>
          
          <p>As travelers, we have the power to demand more sustainable practices from the tourism industry through our booking choices and feedback.</p>
        `,
        author: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        date: new Date('2024-03-05'),
        category: 'Sustainable Travel',
        tags: ['eco-friendly', 'sustainable', 'green travel', 'responsible tourism'],
        image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=2000',
        readTime: 6,
        likes: 215,
        comments: 32,
        trending: false,
      },
      {
        id: '3',
        title: 'Digital Nomad Guide: Best Cities for Remote Work',
        excerpt: 'Where to set up your laptop with the perfect balance of affordability, amenities, and lifestyle.',
        content: `
          <p>The digital nomad lifestyle has exploded in popularity, with more professionals than ever embracing location independence. But choosing the right base can make or break your remote work experience.</p>
          
          <h2>Chiang Mai, Thailand</h2>
          <p>A longtime favorite among digital nomads, Chiang Mai offers an unbeatable combination of low cost of living, fast internet, abundant coworking spaces, and a large expat community.</p>
          
          <h2>Lisbon, Portugal</h2>
          <p>With its vibrant culture, beautiful weather, and growing tech scene, Lisbon has become Europe's digital nomad hotspot. The city offers a high quality of life at a lower cost than other Western European capitals.</p>
          
          <h2>Medellín, Colombia</h2>
          <p>Once notorious for crime, Medellín has transformed into a modern, innovative city with perfect spring-like weather year-round. The affordable cost of living and growing number of coworking spaces make it ideal for remote workers.</p>
          
          <p>When choosing your digital nomad base, consider factors beyond just cost and internet speed. Think about time zone compatibility with your clients or company, visa requirements, healthcare access, and local community.</p>
          
          <p>The most successful digital nomads often establish a rotation between 2-3 favorite locations rather than constantly moving, allowing them to build deeper connections and maintain productivity.</p>
        `,
        author: {
          name: 'Alex Rivera',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        },
        date: new Date('2024-03-18'),
        category: 'Digital Nomad',
        tags: ['remote work', 'digital nomad', 'coworking', 'expat life'],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000',
        readTime: 10,
        likes: 428,
        comments: 73,
        trending: true,
      },
      {
        id: '4',
        title: 'The Ultimate Guide to Street Food Safety',
        excerpt: 'How to enjoy local cuisine without risking your health.',
        content: `
          <p>Street food offers some of the most authentic and delicious culinary experiences when traveling, but concerns about food safety often hold travelers back. Here's how to enjoy local street food while minimizing health risks.</p>
          
          <h2>Look for Popular Stalls</h2>
          <p>Busy stalls with high turnover mean fresher ingredients and lower risk of foodborne illness. If locals are lining up, it's usually a good sign for both taste and safety.</p>
          
          <h2>Watch the Cooking Process</h2>
          <p>Choose stalls where you can see the food being cooked fresh at high temperatures. Avoid pre-cooked items sitting at room temperature.</p>
          
          <h2>Consider Timing</h2>
          <p>Eating at peak meal times ensures you're getting freshly prepared food rather than items that have been sitting out.</p>
          
          <p>While these precautions help, it's also wise to gradually introduce your system to local cuisine rather than diving into the most exotic options immediately. Start with cooked foods before trying raw dishes.</p>
          
          <p>Remember that an upset stomach doesn't always mean food poisoning—sometimes it's just your body adjusting to new bacteria and spices. Pack basic medications just in case, but don't let fear prevent you from experiencing one of travel's greatest pleasures.</p>
        `,
        author: {
          name: 'Priya Patel',
          avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        },
        date: new Date('2024-02-28'),
        category: 'Food & Dining',
        tags: ['street food', 'food safety', 'culinary travel', 'local cuisine'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000',
        readTime: 7,
        likes: 189,
        comments: 41,
        trending: false,
      },
    ];

    res.json(mockPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});

// Get blog post by ID
router.get('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // For development, return mock data
    const mockPost = {
      id,
      title: 'Top 10 Hidden Beaches in Southeast Asia',
      excerpt: 'Discover secluded paradises away from the tourist crowds.',
      content: `
        <p>Southeast Asia is home to some of the world's most beautiful beaches, but many travelers only visit the well-known spots. In this article, we'll take you off the beaten path to discover hidden gems that offer pristine sands, crystal-clear waters, and a peaceful atmosphere away from the crowds.</p>
        
        <h2>1. Koh Rong Samloem, Cambodia</h2>
        <p>This island paradise features powdery white sand beaches and turquoise waters. The lack of roads and limited development means you'll experience true tranquility here.</p>
        
        <h2>2. Nacpan Beach, Philippines</h2>
        <p>Located in El Nido, this four-kilometer stretch of golden sand is far less crowded than other beaches in the area. The gentle waves make it perfect for swimming.</p>
        
        <h2>3. Koh Kradan, Thailand</h2>
        <p>This small island in the Andaman Sea offers some of Thailand's most beautiful coral reefs, perfect for snorkeling right off the beach.</p>
        
        <p>The best time to visit these hidden beaches is during the dry season (November to April), when you'll experience less rainfall and calmer seas. Remember to respect these pristine environments by taking all trash with you and avoiding damage to coral reefs.</p>
        
        <p>For the adventurous traveler willing to venture beyond the typical tourist path, these hidden beaches offer rewards of unspoiled beauty and authentic local experiences.</p>
      `,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      date: new Date('2024-02-15'),
      category: 'Destinations',
      tags: ['beaches', 'southeast asia', 'hidden gems', 'travel tips'],
      image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80&w=2000',
      readTime: 8,
      likes: 342,
      comments: 47,
      trending: true,
    };

    res.json(mockPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
});

// Generate AI blog post
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { topic, keywords, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    // Use GPT to generate blog post
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: `You are a travel writer creating engaging blog content. Write in a ${tone || 'conversational'} tone.`
        },
        {
          role: "user",
          content: `Write a travel blog post about ${topic}. Include these keywords: ${keywords?.join(', ') || 'travel, adventure, tips'}.
            Format the post with HTML tags for headings, paragraphs, and lists.
            Include a catchy title, an engaging introduction, 3-4 main sections with subheadings, and a conclusion.
            The post should be informative, practical, and engaging for travelers.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedContent = response.choices[0].message.content;
    
    // Extract title from the generated content
    const titleMatch = generatedContent.match(/<h1>(.*?)<\/h1>/) || generatedContent.match(/# (.*?)(\n|$)/);
    const title = titleMatch ? titleMatch[1] : 'Generated Travel Article';
    
    // Extract excerpt
    const excerptMatch = generatedContent.match(/<p>(.*?)<\/p>/) || generatedContent.match(/^(?!#)(.*?)(\n|$)/);
    const excerpt = excerptMatch ? excerptMatch[1].substring(0, 150) + '...' : 'Read this AI-generated travel article.';
    
    // Remove title from content if it exists
    const content = generatedContent.replace(/<h1>.*?<\/h1>/, '').trim();
    
    const blogPost = {
      id: Date.now().toString(),
      title,
      excerpt,
      content,
      author: {
        name: 'AI Travel Writer',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      date: new Date(),
      category: keywords?.[0] || 'Travel',
      tags: keywords || ['travel', 'adventure', 'tips'],
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000',
      readTime: Math.ceil(content.length / 1500),
      likes: 0,
      comments: 0,
      trending: false,
    };

    res.json(blogPost);
  } catch (error) {
    console.error('Error generating blog post:', error);
    res.status(500).json({ message: 'Error generating blog post' });
  }
});

// Get travel news and trends
router.get('/news', authenticateToken, async (req, res) => {
  try {
    // Fetch news from RSS feeds
    const feeds = [
      'https://www.travelpulse.com/rss',
      'https://www.travelweekly.com/rss',
      'https://www.lonelyplanet.com/news/feed',
    ];

    const newsItems = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed);
          return feedData.items.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            date: item.pubDate,
            source: new URL(feed).hostname,
          }));
        } catch (error) {
          console.error(`Error fetching feed ${feed}:`, error);
          return [];
        }
      })
    );

    // Use GPT to analyze travel trends
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a travel trend analyst. Identify current travel trends based on recent news."
        },
        {
          role: "user",
          content: `Analyze these travel news items and identify current trends:
            ${JSON.stringify(newsItems.flat())}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const trends = JSON.parse(response.choices[0].message.content);

    res.json({
      news: newsItems.flat(),
      trends,
    });
  } catch (error) {
    console.error('Error fetching travel news:', error);
    res.status(500).json({ message: 'Error fetching travel news' });
  }
});

export default router;