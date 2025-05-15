'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getTestimonials, Testimonial, PLACEHOLDER_IMAGE, initializeTestimonials } from '../../lib/testimonials';

// Default testimonials (fallback if Firebase fetch fails)
const defaultTestimonials = [
  {
    id: '1',
    name: 'Alexandra Chen',
    position: 'Founder & CEO, TechNova',
    image: '/assets/images/testimonial-1.png',
    quote: 'Number Leader transformed my startup journey. The AI-powered insights helped us identify market gaps we would have otherwise missed, and the mentor connections proved invaluable for our expansion strategy.',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    position: 'Managing Partner, Venture Capital Firm',
    image: '/assets/images/testimonial-2.png',
    quote: 'As an investor, I\'ve seen my portfolio performance improve significantly since using Number Leader. The data-driven approach to startup evaluation has helped me make more informed investment decisions.',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    position: 'Innovation Director, Enterprise Accelerator',
    image: '/assets/images/testimonial-3.png',
    quote: 'Number Leader has streamlined our accelerator program operations. We can now provide more personalized guidance to our startups while accessing a global network of resources and expertise.',
  },
];

const TestimonialsSection = () => {
  const sliderRef = useRef<Slider>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [systemInitialized, setSystemInitialized] = useState(false);

  // Initialize testimonials system
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeTestimonials();
        setSystemInitialized(true);
        console.log('Testimonials system initialized successfully in frontend');
      } catch (error) {
        console.error('Error initializing testimonials system in frontend:', error);
      }
    };
    
    initialize();
  }, []);

  // Fetch testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        if (!systemInitialized) return;
        
        const data = await getTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to default testimonials (already set)
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [systemInitialized]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <section 
      id="testimonials" 
      className="bg-testimonial-pattern bg-cover bg-fixed bg-center relative py-24"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary-dark/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-white">Our <span className="text-gold">Alpha Release</span> Thoughts!</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Here from our Alpha&apos;s!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative">
            <button 
              className="nl-slider-arrow nl-slider-prev"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <Slider ref={sliderRef} {...settings} className="nl-testimonial-slider">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id || index} className="outline-none">
                  <motion.div 
                    className="nl-testimonial-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-gold">
                        <Image
                          src={testimonial.image || PLACEHOLDER_IMAGE}
                          alt={testimonial.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <svg className="w-10 h-10 text-gold mb-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-xl leading-relaxed mb-6 text-white">{testimonial.quote}</p>
                        <div>
                          <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                          <p className="text-gold">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>

            <button 
              className="nl-slider-arrow nl-slider-next"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection; 