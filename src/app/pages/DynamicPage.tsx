import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getMenuPages, MenuPage } from '../services/api';
import { Navbar } from '../components/Navbar';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { toast } from 'sonner';

export const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<MenuPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) return;

      try {
        const pages = await getMenuPages();
        // Find page by path (slug format: /about becomes about or page/about)
        const foundPage = pages.find(
          p => p.path === `/${slug}` || p.path === slug || p.path === `page/${slug}`
        );

        if (foundPage) {
          setPage(foundPage);
        } else {
          // Page not found or no content
          navigate('/404', { replace: true });
        }
      } catch (error) {
        console.error('Error loading page:', error);
        toast.error('Failed to load page');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#6B7F39] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#36454F]/70">Loading page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />
      
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-[#36454F] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              {page.label}
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card-enhanced">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:text-[#36454F] 
                prose-p:text-[#36454F]/80
                prose-a:text-[#6B7F39] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#36454F]
                prose-ul:text-[#36454F]/80
                prose-ol:text-[#36454F]/80
                prose-blockquote:text-[#36454F]/70 prose-blockquote:border-[#6B7F39]
                prose-code:text-[#6B7F39] prose-code:bg-[#F5E6D3]/50
                prose-pre:bg-[#36454F] prose-pre:text-white
                prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#36454F] text-white py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F5E6D3]">
            &copy; 2026 Skyway Suites. All rights reserved.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};