import React, { useState } from 'react';
import { GARMENTS } from '../data/garments';
import { CULTURAL_QUIZ_QUESTIONS } from '../data/culturalArticles';
import { Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface CulturePageProps {
  onNavigate: (tab: string) => void;
  onSelectGarmentToRemix: (garmentId: string) => void;
}

export const CulturePage: React.FC<CulturePageProps> = ({
  onNavigate,
  onSelectGarmentToRemix
}) => {
  // Active garment tab
  const [activeGarmentId, setActiveGarmentId] = useState<string>(GARMENTS[0].id);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const selectedGarment = GARMENTS.find((g) => g.id === activeGarmentId) || GARMENTS[0];

  const handleSelectQuizOption = (option: any) => {
    const updated = [...quizAnswers, option];
    setQuizAnswers(updated);

    if (currentQuizIndex + 1 < CULTURAL_QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      const targetGarment = GARMENTS.find((g) => g.id === option.garmentId) || GARMENTS[0];
      setQuizResult({
        garment: targetGarment,
        styleId: option.styleId,
        persona:
          targetGarment.id === 'ao-dai'
            ? 'Thanh Tân Hiện Đại'
            : targetGarment.id === 'ao-ngu-than'
            ? 'Cổ Phong Trí Thức'
            : targetGarment.id === 'nhat-binh'
            ? 'Hoàng Triều Đài Các'
            : targetGarment.id === 'ao-tu-than'
            ? 'Duyên Thầm Kinh Bắc'
            : 'Hào Sảng Sông Nước'
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Title: Monograph Masthead */}
      <div className="border-b border-[#E2D8C7] pb-6">
        <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#A8282B]">
          CHUYÊN KHẢO MỸ THUẬT & DI SẢN CỔ PHỤC
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#111215] mt-1.5">
          Hiểu Đúng Về Việt Phục
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed font-sans">
          Minh định rành rẽ giữa <strong>Quy thức Phẩm phục Cổ truyền</strong> và{' '}
          <strong>Ngôn ngữ Sáng tạo Đương đại</strong>. Thấu suốt cội nguồn để tự hào mặc đẹp.
        </p>
      </div>

      {/* 1. INTERACTIVE GARMENT ENCYCLOPEDIA */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111215]">
            Ngũ Đại Phẩm Phục & Cấu Trúc Nguyên Bản
          </h2>
          <span className="text-xs font-serif text-stone-500 italic">Chọn trang phục để nghiên cứu kết cấu</span>
        </div>

        {/* Garment Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GARMENTS.map((g) => {
            const isActive = activeGarmentId === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGarmentId(g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#18181B] text-[#FAF7F2] shadow-sm border border-[#D4AF37]/40'
                    : 'bg-white hover:bg-[#FAF7F2] text-stone-700 border border-[#E2D8C7]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      g.id === 'ao-dai'
                        ? '#A8282B'
                        : g.id === 'ao-ngu-than'
                        ? '#C59338'
                        : g.id === 'nhat-binh'
                        ? '#6B3074'
                        : g.id === 'ao-tu-than'
                        ? '#182747'
                        : '#1D6246'
                  }}
                />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Garment Deep-Dive Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2D8C7] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative aspect-[3/4] min-h-[420px] rounded-2xl overflow-hidden shadow-inner bg-[#F4EFE6] border border-[#E2D8C7] group">
              <img
                src={selectedGarment.image}
                alt={selectedGarment.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-40% to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFB058]">
                  {selectedGarment.region}
                </span>
                <h3 className="font-serif text-2xl font-bold">{selectedGarment.name}</h3>
                <p className="text-[11px] text-stone-300 font-serif italic truncate">{selectedGarment.era}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectGarmentToRemix(selectedGarment.id);
                onNavigate('studio');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white font-medium text-xs tracking-wide flex items-center justify-center gap-2 shadow-silk transition-all border border-[#D4AF37]/30"
            >
              <Sparkles className="w-4 h-4 text-[#DFB058]" />
              <span>Phối {selectedGarment.name} trong Xưởng May</span>
            </button>
          </div>

          {/* Details Content Column */}
          <div className="lg:col-span-8 space-y-5 text-xs sm:text-sm">
            <div>
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#A8282B]">
                NGUỒN GỐC & CĂN CƯỚC LỊCH SỬ
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                {selectedGarment.name} — {selectedGarment.subtitle}
              </h3>
              <p className="text-stone-600 leading-relaxed mt-2 font-sans">
                {selectedGarment.historyDetails.origin}
              </p>
            </div>

            {/* Micro grid of historical structure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D8C7]">
                <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
                  Kiểu Cổ Áo Chuẩn
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed font-sans">
                  {selectedGarment.historyDetails.collarType}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2D8C7]">
                <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
                  Kết Cấu Tà & Thân Áo
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed font-sans">
                  {selectedGarment.historyDetails.flapStructure}
                </p>
              </div>
            </div>

            {/* Cultural Significance & Remix tips */}
            <div className="space-y-3 pt-2">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-[#A8282B] rounded-full" />
                  <span>Triết lý và Giá trị Di sản</span>
                </h4>
                <p className="text-stone-600 leading-relaxed bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E2D8C7] font-sans">
                  {selectedGarment.culturalNote}
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59338]" />
                  <span>Gợi ý Phối Đồ Văn Minh</span>
                </h4>
                <ul className="space-y-1.5 text-stone-600 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E2D8C7] font-sans">
                  {selectedGarment.modernRemixTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#A8282B] font-bold">✦</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: 4 QUY TẮC VÀNG KHI PHỐI VIỆT PHỤC */}
      <section className="bg-gradient-to-br from-[#111215] via-[#1A181B] to-[#111215] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/30 shadow-editorial-xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#DFB058]">
            QUY ƯỚC ỨNG XỬ THỜI TRANG
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1.5">
            4 Quy Tắc Vàng Khi Phối Việt Phục
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed font-sans">
            Giới hạn của sự sáng tạo nằm ở sự thấu hiểu. Nắm vững 4 nguyên tắc để luôn tự tin diện cổ phục mọi lúc, mọi nơi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {[
            {
              num: 'I',
              title: 'Bảo Toàn Phom Dáng Cốt Lõi',
              desc: 'Không cắt xén quá đà làm mất phom áo lập lĩnh, đối khâm hay xẻ tà nguyên bản. Dáng áo là căn cước định danh của trang phục.'
            },
            {
              num: 'II',
              title: 'Phối Phụ Kiện Có Điểm Dừng',
              desc: 'Đôi sneaker hay chiếc kính mắt tạo nét phá cách thú vị, nhưng hãy giữ một tỷ lệ hài hòa, tránh biến trang phục thành trang phục hóa trang (costume).'
            },
            {
              num: 'III',
              title: 'Tôn Trọng Không Gian & Bối Cảnh',
              desc: 'Không gian tâm linh, đình chùa đòi hỏi sự kín đáo, tôn nghiêm. Không gian phố đi bộ, chụp lookbook cho phép sự tự do, ngẫu hứng nhiều hơn.'
            },
            {
              num: 'IV',
              title: 'Tự Tin Kể Câu Chuyện Văn Hóa',
              desc: 'Mặc Việt phục đẹp nhất là khi bạn có thể trả lời câu hỏi: "Bộ đồ này bắt nguồn từ thời kỳ nào và mang ý nghĩa gì?".'
            }
          ].map((rule) => (
            <div
              key={rule.num}
              className="p-5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-[#D4AF37]/50 transition-colors flex items-start gap-4"
            >
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[#DFB058] shrink-0">
                {rule.num}
              </span>
              <div>
                <h4 className="font-serif font-bold text-base text-[#FAF7F2] mb-1">{rule.title}</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: TRẮC NGHIỆM VUI CỔ PHỤC */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2D8C7] shadow-sm">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F2] text-[#A8282B] text-xs font-serif font-bold border border-[#E2D8C7] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Trắc Nghiệm Cá Tính</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#111215]">
            Bạn hòa hợp với dòng Việt phục nào?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
            Trả lời 3 câu hỏi ngắn để tìm ra dòng trang phục và phong cách đồng điệu nhất với tâm hồn bạn.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-[#FAF7F2] rounded-xl p-6 sm:p-8 border border-[#E2D8C7] shadow-xs">
          {!quizResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-stone-500">
                <span>CÂU HỎI {currentQuizIndex + 1} / {CULTURAL_QUIZ_QUESTIONS.length}</span>
                <span className="text-[#A8282B]">{Math.round(((currentQuizIndex) / CULTURAL_QUIZ_QUESTIONS.length) * 100)}% Hoàn thành</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {CULTURAL_QUIZ_QUESTIONS[currentQuizIndex].question}
              </h3>

              <div className="space-y-2.5 pt-2">
                {CULTURAL_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(opt)}
                    className="w-full p-4 rounded-xl border border-[#E2D8C7] bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2] text-left text-xs sm:text-sm font-medium text-stone-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="font-sans">{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#A8282B] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Quiz Result Screen */
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-[#A8282B] flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-8 h-8 text-[#C59338]" />
              </div>

              <div>
                <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#C59338]">
                  KẾT QUẢ PHONG CÁCH
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Hệ {quizResult.persona}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  Trang phục hòa hợp nhất: <strong>{quizResult.garment.name}</strong>
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-white p-4 rounded-xl border border-[#E2D8C7] font-sans">
                {quizResult.garment.culturalNote}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectGarmentToRemix(quizResult.garment.id);
                    onNavigate('studio');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A8282B] to-[#741416] hover:from-[#741416] hover:to-[#A8282B] text-white font-medium text-xs tracking-wide shadow-silk flex items-center justify-center gap-2 transition-all border border-[#D4AF37]/30"
                >
                  <Sparkles className="w-4 h-4 text-[#DFB058]" />
                  <span>Vào Studio phối {quizResult.garment.name}</span>
                </button>

                <button
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-stone-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#E2D8C7]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại trắc nghiệm</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
