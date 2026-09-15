// src/lib/wordpress/home.ts

import { getPageBySlug, getMediaUrl, HomePageACF } from './pages';

export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    buttonDonate: string;
    buttonLearn: string;
  };
  mission: {
    title: string;
    text: string;
    videoUrl: string;
  };
  quote: {
    text: string;
    author: string;
  };
  vision: {
    title: string;
    text: string;
  };
  objectives: {
    title: string;
    subtitle: string;
    image: string;
    items: { title: string; description: string }[];
  };
  donate: {
    title: string;
    description: string;
    items: string[];
    backgroundImage: string;
    logoImage: string;
    buttonText: string;
    buttonUrl: string;
  };
  founder: {
    title: string;
    name: string;
    message: string;
    image: string;
    buttonText: string;
  };
  news: {
    title: string;
    subtitle: string;
    viewAllText: string;
  };
  cta: {
    title: string;
    description: string;
    buttonDonate: string;
    buttonContact: string;
  };
}

// Helper to get repeater items
function getRepeaterItems(items: any[] | undefined): string[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => item.item || '').filter(Boolean);
}

// Helper to get objectives
function getObjectives(acf: HomePageACF) {
  const objectives = [];
  
  if (acf.objective_1_title && acf.objective_1_description) {
    objectives.push({
      title: acf.objective_1_title,
      description: acf.objective_1_description
    });
  }
  
  if (acf.objective_2_title && acf.objective_2_description) {
    objectives.push({
      title: acf.objective_2_title,
      description: acf.objective_2_description
    });
  }
  
  if (acf.objective_3_title && acf.objective_3_description) {
    objectives.push({
      title: acf.objective_3_title,
      description: acf.objective_3_description
    });
  }
  
  return objectives;
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    // Get page data from WordPress
    const pageData = await getPageBySlug('home');
    
    // If no page data, use default content
    if (!pageData) {
      console.warn('Home page not found in WordPress');
      return getDefaultContent();
    }

    const acf = pageData.acf || {};

    // Get image URLs from IDs - handle gracefully if they fail
    let objectivesImage = '';
    let donateBackgroundImage = '';
    let donateLogoImage = '';
    let founderImage = '';
    
    try {
      [objectivesImage, donateBackgroundImage, donateLogoImage, founderImage] = await Promise.all([
        getMediaUrl(acf.objectives_image || 0),
        getMediaUrl(acf.donate_background_image || 0),
        getMediaUrl(acf.donate_logo_image || 0),
        getMediaUrl(acf.founder_image || 0)
      ]);
    } catch (mediaError) {
      console.warn('Error fetching media URLs:', mediaError);
      // Continue with empty strings for images
    }

    // Build content from ACF fields
    const content: HomePageContent = {
      hero: {
        title: acf.hero_title || 'Rebuilding Community',
        subtitle: acf.hero_subtitle || 'Empowering communities with the knowledge and resources to lead grassroots movements and promote transformative social and political change.',
        buttonDonate: acf.hero_button_donate || 'Donate Now',
        buttonLearn: acf.hero_button_learn || 'Learn More'
      },
      mission: {
        title: acf.mission_title || 'Mission Statement',
        text: acf.mission_text || '',
        videoUrl: acf.mission_video_url || 'https://ubfsf.org/wp-content/uploads/2023/04/ivan-headspin.mp4'
      },
      quote: {
        text: acf.quote_text || 'Education is our passport to the future, for tomorrow belongs to the people who prepare for it today.',
        author: acf.quote_author || 'Malcolm X'
      },
      vision: {
        title: acf.vision_title || 'Vision',
        text: acf.vision_text || 'We envision a world where everyone has access to an education that empowers them to overcome social and economic challenges, breaking the cycle of poverty and dismantling systemic racism.'
      },
      objectives: {
        title: acf.objectives_title || 'UBFSF Organizational Objectives',
        subtitle: acf.objectives_subtitle || '💡 Ideas + ⚙️ Collective Action = 📈 Community Growth',
        image: objectivesImage,
        items: getObjectives(acf)
      },
      donate: {
        title: acf.donate_title || 'Empower Communities Through Education and Opportunity: Donate to UBFSF',
        description: acf.donate_description || 'Every donation directly supports our mission-driven programs that empower underserved communities and foster lasting change.',
        items: getRepeaterItems(acf.donate_items),
        backgroundImage: donateBackgroundImage,
        logoImage: donateLogoImage,
        buttonText: acf.donate_button_text || 'Donate',
        buttonUrl: acf.donate_button_url || 'https://secure.givelively.org/donate/united-black-family-scholarship-foundation'
      },
      founder: {
        title: acf.founder_title || 'A Word From Our Founder',
        name: acf.founder_name || 'Ivan Kilgore',
        message: acf.founder_message || '',
        image: founderImage,
        buttonText: acf.founder_button_text || 'Meet Ivan'
      },
      news: {
        title: acf.news_title || 'From the Newsroom',
        subtitle: acf.news_subtitle || 'Latest Updates',
        viewAllText: acf.news_view_all || 'View All News →'
      },
      cta: {
        title: acf.cta_title || 'Join Us in Rebuilding Community',
        description: acf.cta_description || 'Together, we can create lasting change and build a brighter future for all.',
        buttonDonate: acf.cta_button_donate || 'Donate Now',
        buttonContact: acf.cta_button_contact || 'Get Involved'
      }
    };

    console.log('Home page content loaded successfully');
    return content;

  } catch (error) {
    console.error('Error fetching home content:', error);
    return getDefaultContent();
  }
}

// Default content as fallback
function getDefaultContent(): HomePageContent {
  return {
    hero: {
      title: 'Rebuilding Community',
      subtitle: 'Empowering communities with the knowledge and resources to lead grassroots movements and promote transformative social and political change.',
      buttonDonate: 'Donate Now',
      buttonLearn: 'Learn More'
    },
    mission: {
      title: 'Mission Statement',
      text: 'Our mission at the United Black Family Scholarship Foundation is to foster accessible, high-quality education for individuals of all races, driving systemic change in political structures that perpetuate poverty and inequality.',
      videoUrl: 'https://ubfsf.org/wp-content/uploads/2023/04/ivan-headspin.mp4'
    },
    quote: {
      text: 'Education is our passport to the future, for tomorrow belongs to the people who prepare for it today.',
      author: 'Malcolm X'
    },
    vision: {
      title: 'Vision',
      text: 'We envision a world where everyone has access to an education that empowers them to overcome social and economic challenges, breaking the cycle of poverty and dismantling systemic racism.'
    },
    objectives: {
      title: 'UBFSF Organizational Objectives',
      subtitle: '💡 Ideas + ⚙️ Collective Action = 📈 Community Growth',
      image: '',
      items: [
        {
          title: 'Expand Community Investment and Educational Programs',
          description: 'Implement the Scholarship & Community Grant, Internship, and R.E.B.U.I.L.D. Community Investment Programs over the next 24 to 60 months to support underserved communities.'
        },
        {
          title: 'Foster Social & Economic Change Via Collective Impact',
          description: 'Demonstrate how collaborative action, driven by our programs, empowers communities to overcome economic disparities and foster lasting, positive change.'
        },
        {
          title: 'Strengthen Community-Led Systems for Long-Term Growth',
          description: 'Showcase an organizational framework led by community-driven leaders committed to economic empowerment and social justice.'
        }
      ]
    },
    donate: {
      title: 'Empower Communities Through Education and Opportunity: Donate to UBFSF',
      description: 'Every donation directly supports our mission-driven programs that empower underserved communities and foster lasting change. Your contributions help fund the following initiatives:',
      items: [
        'Grant Programs: Providing financial support to students and community projects.',
        'Sports Programs: Encouraging teamwork, leadership, and healthy living.',
        'Internship Opportunities: Equipping young adults with professional skills and mentorship.',
        'Community Reinvestment Initiatives: Promoting economic growth and sustainability.',
        'Media and Arts Productions: Amplifying voices and sharing impactful stories.',
        'Special Projects: Driving innovation through focused community efforts.'
      ],
      backgroundImage: '',
      logoImage: '',
      buttonText: 'Donate',
      buttonUrl: 'https://secure.givelively.org/donate/united-black-family-scholarship-foundation'
    },
    founder: {
      title: 'A Word From Our Founder',
      name: 'Ivan Kilgore',
      message: 'The United Black Family Scholarship Foundation (UBFSF) is a student- and volunteer-led 501(c)(3) nonprofit organization serving communities in Oklahoma, California, and New York. Founded on May 22, 2014, in Oklahoma, our mission is to use quality education as a powerful tool to challenge systemic poverty and dismantle structures of racism—issues that impact all of society.\n\nWe focus on communities burdened by high incarceration rates, providing resources and opportunities to break the cycle of poverty and incarceration. Our initiatives empower community members and young adults to:\n\n1. Build Life and Job Skills: Develop practical skills that lead to economic independence.\n2. Achieve Economic Stability: Access tools and programs that foster long-term financial growth.\n3. Disrupt the School-to-Prison Pipeline: Provide education and support to help youth and adults pursue brighter futures.\n\nOur approach is rooted in "rebuilding the community from within," empowering individuals to become leaders of change in their own neighborhoods.',
      image: '',
      buttonText: 'Meet Ivan'
    },
    news: {
      title: 'From the Newsroom',
      subtitle: 'Latest Updates',
      viewAllText: 'View All News →'
    },
    cta: {
      title: 'Join Us in Rebuilding Community',
      description: 'Together, we can create lasting change and build a brighter future for all.',
      buttonDonate: 'Donate Now',
      buttonContact: 'Get Involved'
    }
  };
}