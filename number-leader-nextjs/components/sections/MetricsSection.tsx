'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Counter = ({ value, title }: { value: string, title: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  // Parse the value to get the number excluding any plus signs or text
  const parseValue = () => {
    const numericValue = parseInt(value.replace(/\D/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };
  
  const numericValue = parseValue();

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 16)); // Assuming 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-bold text-gold mb-2">
        {isInView ? `${count}${value.includes('+') ? '+' : ''}` : '0'}
      </div>
      <div className="text-xl text-primary-dark">{title}</div>
    </div>
  );
};

const MetricsSection = () => {
  // Define all metrics
  const metrics = [
    { value: "50+", title: "Startups Mentored" },
    { value: "5000+", title: "Benchmarked Companies" },
    { value: "100+", title: "Investor Network" },
    { value: "100+", title: "Investor Network" },
    { value: "20+", title: "Funds Network" },
    { value: "5+", title: "Pitching Events" }
    
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = 2; // We have 6 metrics, showing 3 at a time means we need 2 slides (0 and 1)
  
  // For mobile, we'll track the current metric separately
  const [mobileMetricIndex, setMobileMetricIndex] = useState(0);
  const totalMobileMetrics = metrics.length;
  
  // Handle navigation for desktop
  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };
  
  // Handle navigation for mobile
  const nextMobileMetric = () => {
    setMobileMetricIndex((prevIndex) => (prevIndex + 1) % totalMobileMetrics);
  };
  
  const prevMobileMetric = () => {
    setMobileMetricIndex((prevIndex) => (prevIndex - 1 + totalMobileMetrics) % totalMobileMetrics);
  };
  
  return (
    <section id="metrics" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-dark">Success Metrics & Trust Signals
          </h2>
          <p className="text-xl text-gray-600">Our impact on the startup ecosystem</p>
        </motion.div>

        {/* Mobile view - single carousel */}
        <div className="md:hidden relative max-w-xs mx-auto">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg p-8">
            <Counter 
              value={metrics[mobileMetricIndex].value} 
              title={metrics[mobileMetricIndex].title} 
            />
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg text-primary-dark hover:text-gold transition-colors z-10"
            onClick={prevMobileMetric}
            aria-label="Previous"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button 
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white p-2 rounded-full shadow-lg text-primary-dark hover:text-gold transition-colors z-10"
            onClick={nextMobileMetric}
            aria-label="Next"
          >
            <FaChevronRight size={20} />
          </button>
          
          {/* Indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {metrics.map((_, index) => (
              <button
                key={index}
                onClick={() => setMobileMetricIndex(index)}
                className={`w-3 h-3 rounded-full ${index === mobileMetricIndex ? 'bg-gold' : 'bg-gray-300'}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Desktop view - 3 at once */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          {/* Carousel container */}
          <div className="overflow-hidden rounded-lg">
            {slideIndex === 0 ? (
              // FIRST SLIDE - First 3 metrics
              <div className="grid grid-cols-3 gap-6">
                {metrics.slice(0, 3).map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-8 bg-white rounded-lg shadow-lg"
                  >
                    <Counter 
                      value={metric.value} 
                      title={metric.title} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              // SECOND SLIDE - Last 3 metrics
              <div className="grid grid-cols-3 gap-6">
                {metrics.slice(3, 6).map((metric, index) => (
                  <motion.div
                    key={index + 3}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-8 bg-white rounded-lg shadow-lg"
                  >
                    <Counter 
                      value={metric.value} 
                      title={metric.title} 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          <button 
            className={`absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg text-primary-dark hover:text-gold transition-colors z-10 ${slideIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={prevSlide}
            disabled={slideIndex === 0}
            aria-label="Previous"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button 
            className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white p-2 rounded-full shadow-lg text-primary-dark hover:text-gold transition-colors z-10 ${slideIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={nextSlide}
            disabled={slideIndex === totalSlides - 1}
            aria-label="Next"
          >
            <FaChevronRight size={20} />
          </button>
          
          {/* Indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setSlideIndex(index)}
                className={`w-3 h-3 rounded-full ${index === slideIndex ? 'bg-gold' : 'bg-gray-300'}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection; 