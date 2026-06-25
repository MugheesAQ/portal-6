import React, { useState } from 'react';
import { GovService } from '../types';
import { Search, Shield, Clock, Landmark, BookOpen, Users, Key, CreditCard } from 'lucide-react';

interface ServiceDirectoryProps {
  onSelectService: (service: GovService) => void;
}

export const SERVICES_DATA: GovService[] = [
  {
    id: 'cnic-renew',
    title: 'Smart CNIC Card Renewal',
    description: 'Renew your national identity card with state-of-the-art cryptographic security features.',
    category: 'Identity',
    processingTime: '7-10 Working Days',
    fee: '1,500 PKR',
    requirements: ['Expired CNIC Copy', 'Proof of Residence', 'Marriage Certificate (if applicable)']
  },
  {
    id: 'license-issue',
    title: 'Driving License Application',
    description: 'Apply for a new permanent or learner driving license including scheduling your practical road test.',
    category: 'Licensing',
    processingTime: '14 Working Days',
    fee: '2,000 PKR',
    requirements: ['Learner Permit', 'Medical Fitness Form', 'Original CNIC']
  },
  {
    id: 'utility-gas',
    title: 'Sui Gas New Connection',
    description: 'Request a new residential Sui Gas pipe connection for urban municipal areas.',
    category: 'Utilities',
    processingTime: '30 Days',
    fee: '8,500 PKR',
    requirements: ['Property Registry Docs', 'Neighbor Sui Gas Bill Copy', 'Applicant CNIC Copy']
  },
  {
    id: 'tax-register',
    title: 'NTN Tax Registration',
    description: 'Register as an active taxpayer to file annual income tax and wealth statements.',
    category: 'Taxation',
    processingTime: 'Instant (1-2 Hours)',
    fee: 'Free of Cost',
    requirements: ['Active Email & Mobile Number', 'Proof of Business/Employment', 'CNIC Number']
  },
  {
    id: 'edu-scholarship',
    title: 'Higher Education Board Scholarship',
    description: 'Financial aid and merit scholarships for state university postgraduate applicants.',
    category: 'Education',
    processingTime: '45 Days',
    fee: 'Free of Cost',
    requirements: ['Academic Transcripts', 'Family Income Certificate', 'Admission Offer Letter']
  },
  {
    id: 'welfare-support',
    title: 'Social Safety Income Support',
    description: 'Quarterly financial assistance scheme for underprivileged national citizens.',
    category: 'Welfare',
    processingTime: '21 Days',
    fee: 'Free of Cost',
    requirements: ['Poverty Index Verification Form', 'Biometric Register Verification', 'CNIC']
  }
];

export const ServiceDirectory: React.FC<ServiceDirectoryProps> = ({ onSelectService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Identity', 'Licensing', 'Utilities', 'Taxation', 'Education', 'Welfare'];

  const filteredServices = SERVICES_DATA.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Identity': return <Shield size={16} className="text-[#002147]" />;
      case 'Licensing': return <Key size={16} className="text-amber-600" />;
      case 'Utilities': return <Clock size={16} className="text-blue-600" />;
      case 'Taxation': return <CreditCard size={16} className="text-emerald-600" />;
      case 'Education': return <BookOpen size={16} className="text-indigo-600" />;
      case 'Welfare': return <Users size={16} className="text-pink-600" />;
      default: return <Landmark size={16} className="text-slate-600" />;
    }
  };

  return (
    <div id="service-directory" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#002147] tracking-tight">Government Services Directory</h2>
          <p className="text-slate-500 text-sm mt-1">Submit digital application forms with certified electronic document uploads.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search digital services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-[#002147] text-white shadow-md'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat !== 'All' && getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Landmark size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-600">No Services Found</p>
          <p className="text-xs mt-1">Try refining your search query or choosing another department tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="border border-slate-200 rounded-xl p-6 bg-white hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <span className="bg-slate-100 text-[#002147] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                    {getCategoryIcon(service.category)}
                    {service.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{service.processingTime}</span>
                </div>
                
                <h3 className="text-base font-bold text-[#002147] mb-2">{service.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{service.description}</p>
                
                <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Required Proof Docs:</p>
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {service.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Fee: <strong className="text-[#002147]">{service.fee}</strong></span>
                <button
                  onClick={() => onSelectService(service)}
                  className="bg-[#002147] text-white hover:bg-opacity-90 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#002147]/10"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
