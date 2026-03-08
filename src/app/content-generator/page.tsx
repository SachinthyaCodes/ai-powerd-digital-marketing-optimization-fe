'use client';

import { useState, useRef } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { 
  SparklesIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowPathIcon,
  TagIcon,
  GlobeAltIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  TicketIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ClockIcon,
  BoltIcon,
  TrophyIcon,
  StarIcon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { generateSmartPoster, getPosterUrl, buildDescription, mapTone } from '@/services/contentApiService';

type PosterSize = 'facebook' | 'instagram' | 'story' | 'twitter';
type Tag = 'great-value' | 'new-arrival' | 'best-seller' | 'limited-time' | 'special-offer' | 'top-rated' | 'free-delivery' | 'easy-installments';

const PRODUCT_CATEGORIES = {
  'Electronics & Appliances': [
    { name: 'Smartphone' },
    { name: 'Smart TV' },
    { name: 'Laptop' },
    { name: 'Washing Machine' },
    { name: 'Robot Vacuum' },
  ],
  'Fashion & Beauty': [
    { name: 'Saree Collection' },
    { name: 'Skincare Set' },
    { name: 'Handbag' },
    { name: 'Jewellery Set' },
  ],
  'Furniture & Home': [
    { name: 'Sofa Set' },
    { name: 'Dining Table' },
    { name: 'Office Chair' },
    { name: 'Bed Frame' },
  ],
  'Food & Restaurant': [
    { name: 'Kottu Promotion' },
    { name: 'Pizza Deal' },
    { name: 'Burger Combo' },
    { name: 'Lunch Buffet' },
  ],
  'Grocery & Retail': [
    { name: 'Rice & Essentials' },
    { name: 'Fresh Vegetables' },
    { name: 'Spice Pack' },
  ],
  'Services': [
    { name: 'Plumbing Service' },
    { name: 'Tuition Classes' },
    { name: 'Car Wash' },
    { name: 'Salon Offer' },
  ],
};

const SEASONS = [
  'No specific season',
  'Sinhala & Tamil New Year',
  'Vesak',
  'Christmas',
  'New Year',
  'Valentine\'s Day',
  'Easter',
  'Poson',
  'Deepavali',
  'Ramadan',
  'Thai Pongal',
  'Summer Sale',
  'Black Friday',
  'Cyber Monday',
  'Back to School',
];

const DISCOUNT_OPTIONS = [
  '',
  '10%',
  '15%',
  '20%',
  '25%',
  '30%',
  '40%',
  '50%',
  '60%',
  '70%',
  'Up to 50% OFF',
  'Up to 70% OFF',
  'Buy 1 Get 1 Free',
  'Buy 2 Get 1 Free',
];

const MARKETING_HIGHLIGHTS: { id: Tag; label: string; description: string; icon: 'dollar' | 'gift' | 'clock' | 'bolt' | 'trophy' | 'star' | 'truck' | 'credit' }[] = [
  { id: 'great-value', label: 'Great deal', icon: 'dollar', description: 'Emphasizes value for money' },
  { id: 'special-offer', label: 'Special offer', icon: 'gift', description: 'Highlights a promotion or deal' },
  { id: 'limited-time', label: 'Limited time only', icon: 'clock', description: 'Creates urgency to buy now' },
  { id: 'new-arrival', label: 'New arrival', icon: 'bolt', description: 'Showcases your latest product' },
  { id: 'best-seller', label: 'Best seller', icon: 'trophy', description: 'Shows customer popularity' },
  { id: 'top-rated', label: 'Top rated', icon: 'star', description: 'Highlights quality & reviews' },
  { id: 'free-delivery', label: 'Free delivery', icon: 'truck', description: 'Attracts with free shipping' },
  { id: 'easy-installments', label: 'Pay in installments', icon: 'credit', description: 'Makes it affordable' },
];

const HIGHLIGHT_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  dollar: CurrencyDollarIcon,
  gift: GiftIcon,
  clock: ClockIcon,
  bolt: BoltIcon,
  trophy: TrophyIcon,
  star: StarIcon,
  truck: TruckIcon,
  credit: CreditCardIcon,
};

const POSTER_SIZES = [
  { id: 'facebook', label: 'Facebook Post' },
  { id: 'instagram', label: 'Instagram Post' },
  { id: 'story', label: 'Instagram / FB Story' },
  { id: 'twitter', label: 'Twitter / X Post' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'Sinhala (සිංහල)' },
  { code: 'en-si', label: 'Bilingual (English + Sinhala)' },
];

export default function ContentGeneratorPage() {
  const [productName, setProductName] = useState('');
  const [showProductSuggestions, setShowProductSuggestions] = useState(true);
  const [season, setSeason] = useState('No specific season');
  const [discount, setDiscount] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [language, setLanguage] = useState('si');
  const [selectedSizes, setSelectedSizes] = useState<PosterSize[]>(['facebook']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedPosters, setGeneratedPosters] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'poster'>('content');
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<any>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [lastGenerateMode, setLastGenerateMode] = useState<boolean>(false);

  const handleProductSuggestion = (label: string) => {
    setProductName(label);
    setShowProductSuggestions(false);
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const handleDownloadPoster = async (poster: any) => {
    try {
      const link = document.createElement('a');
      link.href = poster.url;
      link.download = `${productName}-${poster.size}-poster.png`;
      link.target = '_blank';
      
      try {
        const response = await fetch(poster.url, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } else {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
      window.open(poster.url, '_blank');
    }
  };

  const openPosterModal = (poster: any) => {
    setSelectedPoster(poster);
    setShowPosterModal(true);
  };

  const closePosterModal = () => {
    setShowPosterModal(false);
    setSelectedPoster(null);
  };

  const toggleTag = (tagId: Tag) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleSize = (sizeId: PosterSize) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId) 
        ? prev.filter(s => s !== sizeId)
        : [...prev, sizeId]
    );
  };

  const copyForPlatform = (platform: string) => {
    if (!generatedContent) return;
    const hashtagStr = hashtags.length > 0 ? '\n\n' + hashtags.join(' ') : '';
    const text = generatedContent + hashtagStr;
    navigator.clipboard.writeText(text);
    setCopySuccess(platform);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const shareToWhatsApp = () => {
    if (!generatedContent) return;
    const hashtagStr = hashtags.length > 0 ? '\n\n' + hashtags.join(' ') : '';
    const text = encodeURIComponent(generatedContent + hashtagStr);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const mapLanguage = (code: string): 'english' | 'sinhala' | 'both' => {
    const mapping: Record<string, 'english' | 'sinhala' | 'both'> = {
      'en': 'english',
      'si': 'sinhala',
      'en-si': 'both'
    };
    return mapping[code] || 'english';
  };

  const handleGenerateContent = async (includePoster: boolean) => {
    if (!productName.trim()) {
      alert('Please enter a product or service name');
      return;
    }

    setIsGenerating(true);
    setActiveTab('content');
    setLastGenerateMode(includePoster);
    setActivePosterIndex(0);

    try {
      const description = buildDescription({
        discount,
        tags: selectedTags,
        season: season !== 'No specific season' ? season : undefined,
      });

      const tone = mapTone(selectedTags);
      const backendLanguage = mapLanguage(language);

      if (includePoster) {
        const sizesToGenerate = selectedSizes.length > 0 ? selectedSizes : ['facebook' as PosterSize];

        const posterPromises = sizesToGenerate.map(size =>
          generateSmartPoster({
            product_name: productName,
            description,
            tone,
            language: backendLanguage,
            season: season !== 'No specific season' ? season : undefined,
            discount: discount || undefined,
            business_name: businessName || undefined,
            phone_number: phoneNumber || undefined,
            tags: selectedTags,
            size,
          })
        );

        const responses = await Promise.all(posterPromises);
        const firstResponse = responses[0];

        setGeneratedContent(firstResponse.content);
        setHashtags(firstResponse.hashtags || []);

        const posters = responses.map((response, index) => ({
          size: sizesToGenerate[index],
          url: response.poster_path ? getPosterUrl(response.poster_path) : null,
          label: POSTER_SIZES.find(s => s.id === sizesToGenerate[index])?.label || sizesToGenerate[index],
        })).filter(p => p.url);
        
        setGeneratedPosters(posters);
        
      } else {
        const response = await generateSmartPoster({
          product_name: productName,
          description,
          tone,
          language: backendLanguage,
          season: season !== 'No specific season' ? season : undefined,
          discount: discount || undefined,
          tags: selectedTags,
        });

        setGeneratedContent(response.content);
        setHashtags(response.hashtags || []);
        setGeneratedPosters([]);
      }

      setIsGenerating(false);
      
    } catch (error) {
      console.error('Error generating content:', error);
      alert(`Something went wrong. Please try again.\n${error instanceof Error ? error.message : ''}`);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerateContent(lastGenerateMode);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#0B0F14]">
          <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#0B0F14] to-[#0d1f1a]">
            {/* Hero Section */}
            <div className="border-b border-[#1F2933]">
              <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-semibold text-[#F9FAFB] mb-3 tracking-tight">Create Your Ad Content</h1>
                  <p className="text-[#CBD5E1] text-lg">Generate ready-to-post marketing content and professional ad posters for your business in seconds</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Input Form Section */}
                <div className="bg-[#0B0F14]/80 backdrop-blur-sm border border-[#1F2933] rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F2933] mb-4">
                        <DocumentTextIcon className="h-5 w-5 text-[#F9FAFB]" />
                      </div>
                      <h2 className="text-2xl font-semibold text-[#F9FAFB] mb-1">Tell Us About Your Product</h2>
                      <p className="text-[#CBD5E1] text-sm">Fill in the details and we&apos;ll create the perfect ad for you</p>
                    </div>

                    <div className="space-y-5">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#F9FAFB] mb-2">
                          What are you selling? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => {
                            setProductName(e.target.value);
                            setShowProductSuggestions(true);
                          }}
                          onFocus={() => setShowProductSuggestions(true)}
                          placeholder="e.g., Samsung Galaxy Phone, Chicken Kottu, Sofa Set..."
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB] placeholder:text-[#CBD5E1]/50"
                        />
                        
                        {showProductSuggestions && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-[#CBD5E1]">Or pick from popular categories:</p>
                              <button
                                onClick={() => setShowProductSuggestions(false)}
                                className="text-xs text-[#CBD5E1] hover:text-[#F9FAFB]"
                              >
                                Hide
                              </button>
                            </div>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                              {Object.entries(PRODUCT_CATEGORIES).map(([category, products]) => (
                                <div key={category}>
                                  <p className="text-xs font-medium text-[#CBD5E1] mb-1.5">{category}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {products.map((product) => (
                                      <button
                                        key={product.name}
                                        onClick={() => handleProductSuggestion(product.name)}
                                        className="px-2.5 py-1.5 bg-[#1F2933] hover:bg-[#2D3748] border border-[#1F2933] rounded-lg text-xs text-[#F9FAFB] transition-colors"
                                      >
                                        {product.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!showProductSuggestions && productName && (
                          <button
                            onClick={() => setShowProductSuggestions(true)}
                            className="text-xs text-[#22C55E] hover:text-[#16A34A] mt-2"
                          >
                            Show suggestions
                          </button>
                        )}
                      </div>

                      {/* Season/Festival */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          Season / Festival <span className="text-[#CBD5E1] text-xs font-normal">(Optional)</span>
                        </label>
                        <select
                          value={season}
                          onChange={(e) => setSeason(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB]"
                        >
                          {SEASONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {season !== 'No specific season' && (
                          <p className="text-xs text-[#22C55E] mt-1.5">Your ad will have a festive {season} touch!</p>
                        )}
                      </div>

                      {/* Discount */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                          <TicketIcon className="h-4 w-4" />
                          Discount / Offer <span className="text-[#CBD5E1] text-xs font-normal">(Optional)</span>
                        </label>
                        <select
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB]"
                        >
                          <option value="">No discount</option>
                          {DISCOUNT_OPTIONS.filter(d => d !== '').map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        {discount && (
                          <p className="text-xs text-[#22C55E] mt-1.5">Your {discount} offer will be highlighted in the ad</p>
                        )}
                      </div>

                      {/* Business Name & Phone in a row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                            <BuildingStorefrontIcon className="h-4 w-4" />
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Your Shop Name"
                            className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB] placeholder:text-[#CBD5E1]/50"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                            <PhoneIcon className="h-4 w-4" />
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+94 77 123 4567"
                            className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB] placeholder:text-[#CBD5E1]/50"
                          />
                        </div>
                      </div>

                      {/* Marketing Highlights (simplified tags) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB]">
                            <TagIcon className="h-4 w-4" />
                            What do you want to highlight? <span className="text-[#CBD5E1] text-xs font-normal">(Optional)</span>
                          </label>
                          {selectedTags.length > 0 && (
                            <button
                              onClick={clearAllTags}
                              className="text-xs text-[#CBD5E1] hover:text-[#F9FAFB] underline"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {MARKETING_HIGHLIGHTS.map((highlight) => {
                            const IconComp = HIGHLIGHT_ICONS[highlight.icon];
                            return (
                              <button
                                key={highlight.id}
                                onClick={() => toggleTag(highlight.id)}
                                title={highlight.description}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                  selectedTags.includes(highlight.id)
                                    ? 'bg-[#22C55E] text-[#0B0F14] shadow-lg shadow-[#22C55E]/20'
                                    : 'bg-[#1F2933] text-[#F9FAFB] hover:bg-[#2D3748] border border-[#2D3748]'
                                }`}
                              >
                                <IconComp className="h-3.5 w-3.5" />
                                {highlight.label}
                              </button>
                            );
                          })}
                        </div>
                        
                        <p className="text-xs text-[#CBD5E1] mt-2">
                          {selectedTags.length > 0 
                            ? `${selectedTags.length} selected — your ad will emphasize these points` 
                            : 'Pick what makes your offer stand out'}
                        </p>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                          <GlobeAltIcon className="h-4 w-4" />
                          Ad Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-[#1F2933] rounded-xl focus:outline-none focus:border-[#CBD5E1]/30 text-[#F9FAFB]"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Poster Sizes */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[#F9FAFB] mb-2">
                          <PhotoIcon className="h-4 w-4" />
                          Where will you post this?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {POSTER_SIZES.map((size) => (
                            <button
                              key={size.id}
                              onClick={() => toggleSize(size.id as PosterSize)}
                              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2 ${
                                selectedSizes.includes(size.id as PosterSize)
                                  ? 'bg-[#22C55E] text-[#0B0F14]'
                                  : 'bg-[#1F2933] text-[#F9FAFB] hover:bg-[#2D3748]'
                              }`}
                            >
                              {selectedSizes.includes(size.id as PosterSize) ? (
                                <CheckCircleIcon className="h-4 w-4" />
                              ) : (
                                <PhotoIcon className="h-4 w-4" />
                              )}
                              {size.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-[#CBD5E1] mt-1.5">Select one or more platforms — we&apos;ll create the right size for each</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4 pt-3">
                        <button
                          onClick={() => handleGenerateContent(false)}
                          disabled={isGenerating || !productName.trim()}
                          className="w-full bg-[#22C55E] text-[#0B0F14] py-4 px-6 rounded-xl font-semibold hover:bg-[#16A34A] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <DocumentTextIcon className="h-5 w-5" />
                              Generate Ad Text
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleGenerateContent(true)}
                          disabled={isGenerating || !productName.trim()}
                          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#6D28D9] hover:to-[#1D4ED8] transition-all disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-5 w-5" />
                              Create Ad Poster
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Section */}
                <div className="bg-[#0B0F14]/80 backdrop-blur-sm border border-[#1F2933] rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#22C55E]/10 mb-4">
                        <SparklesIcon className="h-5 w-5 text-[#22C55E]" />
                      </div>
                      <h2 className="text-2xl font-semibold text-[#F9FAFB] mb-1">Your Ad Content</h2>
                      <p className="text-[#CBD5E1] text-sm">Ready to copy, download, and share</p>
                    </div>

                    {generatedContent ? (
                      <div className="space-y-5">
                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-[#1F2933]">
                          <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-3 font-medium text-sm transition-colors ${
                              activeTab === 'content'
                                ? 'text-[#22C55E] border-b-2 border-[#22C55E]'
                                : 'text-[#CBD5E1] hover:text-[#F9FAFB]'
                            }`}
                          >
                            <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                            Ad Text
                          </button>
                          {generatedPosters.length > 0 && (
                            <button
                              onClick={() => setActiveTab('poster')}
                              className={`px-4 py-3 font-medium text-sm transition-colors ${
                                activeTab === 'poster'
                                  ? 'text-[#22C55E] border-b-2 border-[#22C55E]'
                                  : 'text-[#CBD5E1] hover:text-[#F9FAFB]'
                              }`}
                            >
                              <PhotoIcon className="h-4 w-4 inline mr-2" />
                              Posters ({generatedPosters.length})
                            </button>
                          )}
                        </div>

                        {/* Content Tab */}
                        {activeTab === 'content' && (
                          <div className="space-y-4">
                            <div className="bg-[#1F2933] rounded-xl p-5">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-[#F9FAFB]">Your Marketing Text</h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleRegenerate}
                                    disabled={isGenerating}
                                    className="px-3 py-1.5 bg-[#0B0F14] text-[#CBD5E1] rounded-lg text-xs hover:bg-[#2D3748] transition-colors flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <ArrowPathIcon className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                                    Try Again
                                  </button>
                                </div>
                              </div>
                              <div className="text-[#CBD5E1] whitespace-pre-line text-sm leading-relaxed">
                                {generatedContent}
                              </div>
                              
                              {/* Hashtags */}
                              {hashtags.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-[#2D3748]">
                                  <p className="text-xs text-[#CBD5E1] mb-2">Suggested Hashtags:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {hashtags.map((tag, i) => (
                                      <span key={i} className="px-2 py-1 bg-[#0B0F14] text-[#22C55E] rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Copy & Share Actions */}
                            <div className="bg-[#1F2933] rounded-xl p-4">
                              <p className="text-xs font-medium text-[#CBD5E1] mb-3">Copy & Share</p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => copyForPlatform('Facebook')}
                                  className="px-3 py-2.5 bg-[#0B0F14] text-[#F9FAFB] rounded-lg text-xs hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
                                >
                                  {copySuccess === 'Facebook' ? (
                                    <><CheckCircleIcon className="h-4 w-4 text-[#22C55E]" /> Copied!</>
                                  ) : (
                                    <><ClipboardDocumentIcon className="h-4 w-4" /> Copy for Facebook</>
                                  )}
                                </button>
                                <button
                                  onClick={() => copyForPlatform('Instagram')}
                                  className="px-3 py-2.5 bg-[#0B0F14] text-[#F9FAFB] rounded-lg text-xs hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
                                >
                                  {copySuccess === 'Instagram' ? (
                                    <><CheckCircleIcon className="h-4 w-4 text-[#22C55E]" /> Copied!</>
                                  ) : (
                                    <><ClipboardDocumentIcon className="h-4 w-4" /> Copy for Instagram</>
                                  )}
                                </button>
                                <button
                                  onClick={() => copyForPlatform('Twitter')}
                                  className="px-3 py-2.5 bg-[#0B0F14] text-[#F9FAFB] rounded-lg text-xs hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
                                >
                                  {copySuccess === 'Twitter' ? (
                                    <><CheckCircleIcon className="h-4 w-4 text-[#22C55E]" /> Copied!</>
                                  ) : (
                                    <><ClipboardDocumentIcon className="h-4 w-4" /> Copy for Twitter/X</>
                                  )}
                                </button>
                                <button
                                  onClick={shareToWhatsApp}
                                  className="px-3 py-2.5 bg-[#22C55E]/20 text-[#22C55E] rounded-lg text-xs hover:bg-[#22C55E]/30 transition-colors flex items-center justify-center gap-2"
                                >
                                  <ChatBubbleLeftIcon className="h-4 w-4" />
                                  Share via WhatsApp
                                </button>
                              </div>
                            </div>

                            {/* Quality Badge */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 rounded-lg">
                              <CheckCircleIcon className="h-4 w-4 text-[#22C55E]" />
                              <p className="text-xs text-[#22C55E] font-medium">Content quality verified — ready to post</p>
                            </div>
                          </div>
                        )}

                        {/* Poster Tab — Gallery/Carousel */}
                        {activeTab === 'poster' && generatedPosters.length > 0 && (
                          <div className="space-y-4">
                            {/* Carousel Navigation */}
                            {generatedPosters.length > 1 && (
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-[#CBD5E1]">
                                  {generatedPosters[activePosterIndex]?.label} ({activePosterIndex + 1} of {generatedPosters.length})
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setActivePosterIndex(prev => Math.max(0, prev - 1))}
                                    disabled={activePosterIndex === 0}
                                    className="p-2 bg-[#1F2933] rounded-lg text-[#F9FAFB] hover:bg-[#2D3748] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setActivePosterIndex(prev => Math.min(generatedPosters.length - 1, prev + 1))}
                                    disabled={activePosterIndex === generatedPosters.length - 1}
                                    className="p-2 bg-[#1F2933] rounded-lg text-[#F9FAFB] hover:bg-[#2D3748] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <ChevronRightIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Active Poster Display */}
                            <div className="bg-[#1F2933] rounded-xl p-5">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-[#F9FAFB]">
                                  {generatedPosters[activePosterIndex]?.label}
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDownloadPoster(generatedPosters[activePosterIndex])}
                                    className="px-3 py-1.5 bg-[#22C55E] text-[#0B0F14] rounded-lg text-xs hover:bg-[#16A34A] transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                                    Download
                                  </button>
                                </div>
                              </div>
                              <div 
                                className="bg-[#0B0F14] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => openPosterModal(generatedPosters[activePosterIndex])}
                              >
                                <img 
                                  src={generatedPosters[activePosterIndex]?.url} 
                                  alt={`${generatedPosters[activePosterIndex]?.label} poster`}
                                  className="w-full h-auto"
                                />
                              </div>
                              <p className="text-xs text-[#CBD5E1] mt-2">Click poster to view full size</p>
                            </div>

                            {/* Thumbnail strip for multiple posters */}
                            {generatedPosters.length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {generatedPosters.map((poster, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setActivePosterIndex(index)}
                                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                      index === activePosterIndex
                                        ? 'border-[#22C55E]'
                                        : 'border-[#1F2933] hover:border-[#2D3748]'
                                    }`}
                                  >
                                    <img 
                                      src={poster.url}
                                      alt={poster.label}
                                      className="w-20 h-14 object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Download All */}
                            {generatedPosters.length > 1 && (
                              <button
                                onClick={() => generatedPosters.forEach(p => handleDownloadPoster(p))}
                                className="w-full py-3 bg-[#22C55E] text-[#0B0F14] rounded-xl text-sm font-semibold hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                Download All {generatedPosters.length} Posters
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#22C55E]/10 to-[#7C3AED]/10 mb-5">
                          <SparklesIcon className="h-10 w-10 text-[#CBD5E1]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">Your Ad Will Appear Here</h3>
                        <p className="text-[#CBD5E1] text-sm max-w-xs mx-auto">Enter your product details on the left, then click &quot;Generate Ad Text&quot; or &quot;Create Ad Poster&quot; to get started</p>
                        <div className="mt-6 p-4 bg-[#1F2933] rounded-xl max-w-xs mx-auto text-left">
                          <p className="text-xs font-medium text-[#22C55E] mb-2">Quick tip:</p>
                          <p className="text-xs text-[#CBD5E1]">Just type your product name and click &quot;Create Ad Poster&quot; — we&apos;ll handle the rest! You can always customize more later.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Poster Preview Modal */}
            {showPosterModal && selectedPoster && (
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={closePosterModal}
              >
                <div 
                  className="bg-[#0B0F14] border border-[#1F2933] rounded-2xl max-w-5xl max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-[#0B0F14] border-b border-[#1F2933] p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-[#F9FAFB]">
                        {selectedPoster.label}
                      </h3>
                      <p className="text-sm text-[#CBD5E1] mt-1">
                        {productName}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadPoster(selectedPoster)}
                        className="px-4 py-2 bg-[#22C55E] text-[#0B0F14] rounded-lg text-sm font-medium hover:bg-[#16A34A] transition-colors flex items-center gap-2"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        onClick={closePosterModal}
                        className="px-4 py-2 bg-[#1F2933] text-[#F9FAFB] rounded-lg text-sm font-medium hover:bg-[#2D3748] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <div className="bg-[#1F2933] rounded-lg overflow-hidden">
                      <img 
                        src={selectedPoster.url} 
                        alt={`${selectedPoster.label} poster preview`}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
