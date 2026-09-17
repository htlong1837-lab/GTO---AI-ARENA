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
      // Calculate quiz result
      // Pick most frequent garmentId or last chosen
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
      {/* Page Title */}
      <div className="border-b border-heritage-border/70 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-heritage-red font-mono">
          Cultural Knowledge Hub
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
          Hiểu Đúng Về Việt Phục
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Phân định rõ nét giữa <strong>Giá trị Di sản Truyền thống</strong> và{' '}
          <strong>Sáng tạo Cách tân Thế hệ mới</strong>. Tìm hiểu để mặc đẹp và tự hào về cội nguồn.
        </p>
      </div>

      {/* 1. INTERACTIVE GARMENT ENCYCLOPEDIA */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            5 Dòng Việt Phục & Cấu Trúc Nguyên Bản
          </h2>
          <span className="text-xs text-stone-500">Nhấp chọn để xem đặc trưng cội nguồn</span>
        </div>

        {/* Garment Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GARMENTS.map((g) => {
            const isActive = activeGarmentId === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGarmentId(g.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-heritage-charcoal text-white shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-heritage-border/80'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      g.id === 'ao-dai'
                        ? '#9B1D20'
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-border/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-inner bg-stone-100 border border-stone-200">
              <img
                src={selectedGarment.image}
                alt={selectedGarment.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {selectedGarment.region}
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedGarment.name}</h3>
                <p className="text-[11px] text-stone-300 truncate">{selectedGarment.era}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectGarmentToRemix(selectedGarment.id);
                onNavigate('studio');
              }}
              className="w-full py-3 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs flex items-center justify-center gap-2 shadow-red-glow transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Phối {selectedGarment.name} trong Studio</span>
            </button>
          </div>

          {/* Details Content Column */}
          <div className="lg:col-span-8 space-y-5 text-xs sm:text-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Nguồn Gốc & Ý Nghĩa
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                {selectedGarment.name} — {selectedGarment.subtitle}
              </h3>
              <p className="text-stone-600 leading-relaxed mt-2">
                {selectedGarment.historyDetails.origin}
              </p>
            </div>

            {/* Micro grid of historical structure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-1">
                  Kiểu Cổ Áo Chuẩn
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {selectedGarment.historyDetails.collarType}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-1">
                  Kết Cấu Tà & Thân Áo
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {selectedGarment.historyDetails.flapStructure}
                </p>
              </div>
            </div>

            {/* Cultural Significance & Remix tips */}
            <div className="space-y-3 pt-2">
              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-heritage-red rounded-full" />
                  Triết lý và Giá trị văn hóa
                </h4>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                  {selectedGarment.culturalNote}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Gợi ý Gen Z Remix văn minh
                </h4>
                <ul className="space-y-1 text-stone-600 bg-rose-50/40 p-3.5 rounded-2xl border border-rose-200/50">
                  {selectedGarment.modernRemixTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✦</span>
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
      <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-stone-800">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-gold font-mono">
            Quy Ước Ứng Xử Thời Trang
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            4 Quy Tắc Vàng Khi Gen Z Phối Việt Phục
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Giới hạn của sự sáng tạo nằm ở sự tôn trọng. Nắm vững 4 nguyên tắc để luôn tự tin diện cổ phục mọi lúc, mọi nơi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {[
            {
              num: '01',
              title: 'Bảo Toàn Phom Dáng Cốt Lõi',
              desc: 'Không cắt xén quá đà làm mất phom áo lập lĩnh, đối khâm hay xẻ tà nguyên bản. Dáng áo là căn cước định danh của trang phục.'
            },
            {
              num: '02',
              title: 'Phối Phụ Kiện Có Điểm Dừng',
              desc: 'Đôi sneaker hay chiếc kính mắt tạo nét phá cách thú vị, nhưng hãy giữ một tỷ lệ hài hòa, tránh biến trang phục thành trang phục hóa trang (costume).'
            },
            {
              num: '03',
              title: 'Tôn Trọng Không Gian & Bối Cảnh',
              desc: 'Không gian tâm linh, đình chùa đòi hỏi sự kín đáo, tôn nghiêm. Không gian phố đi bộ, chụp lookbook cho phép sự tự do, ngẫu hứng nhiều hơn.'
            },
            {
              num: '04',
              title: 'Tự Tin Kể Câu Chuyện Văn Hóa',
              desc: 'Mặc Việt phục đẹp nhất là khi bạn có thể trả lời câu hỏi: "Bộ đồ này bắt nguồn từ thời kỳ nào và mang ý nghĩa gì?".'
            }
          ].map((rule) => (
            <div
              key={rule.num}
              className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/80 hover:border-heritage-gold/50 transition-colors flex items-start gap-4"
            >
              <span className="font-serif font-bold text-2xl sm:text-3xl text-heritage-gold shrink-0">
                {rule.num}
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">{rule.title}</h4>
                <p className="text-xs text-stone-300 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: TRẮC NGHIỆM VUI CỔ PHỤC */}
      <section className="bg-gradient-to-br from-amber-50/70 to-rose-50/40 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-heritage-red text-xs font-bold border border-rose-200 shadow-xs mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Trắc Nghiệm Tương Tác</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Bạn thuộc hệ Việt phục nào?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Trả lời 3 câu hỏi nhanh để tìm ra dòng trang phục và phong cách hòa hợp nhất với cá tính của bạn.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-heritage-border shadow-sm">
          {!quizResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                <span>CÂU HỎI {currentQuizIndex + 1} / {CULTURAL_QUIZ_QUESTIONS.length}</span>
                <span className="text-heritage-red">{Math.round(((currentQuizIndex) / CULTURAL_QUIZ_QUESTIONS.length) * 100)}% Hoàn thành</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {CULTURAL_QUIZ_QUESTIONS[currentQuizIndex].question}
              </h3>

              <div className="space-y-2.5 pt-2">
                {CULTURAL_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(opt)}
                    className="w-full p-4 rounded-2xl border border-stone-200 hover:border-heritage-charcoal hover:bg-stone-50 text-left text-xs sm:text-sm font-semibold text-stone-800 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Quiz Result Screen */
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-heritage-red flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-gold font-mono">
                  Kết Quả Cá Tính
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Hệ {quizResult.persona}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Trang phục hòa hợp nhất: <strong>{quizResult.garment.name}</strong>
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                {quizResult.garment.culturalNote}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectGarmentToRemix(quizResult.garment.id);
                    onNavigate('studio');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-heritage-red hover:bg-heritage-red-dark text-white font-bold text-xs shadow-red-glow flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Vào Studio phối ngay {quizResult.garment.name}</span>
                </button>

                <button
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
