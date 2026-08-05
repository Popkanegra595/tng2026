import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, Save, Send, Asterisk, Sparkles, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WavyText = ({ text, className, style }: { text: string, className?: string, style?: React.CSSProperties }) => {
  return (
    <span className={`inline-flex ${className || ''}`} style={style}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut"
          }}
          style={{ whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const ExplosionEffect: React.FC<{ size: 'mini' | 'huge' }> = ({ size }) => {
  const isHuge = size === 'huge';
  const particleCount = isHuge ? 150 : 30;
  const colors = ['#ff0000', '#ffaa00', '#ffff00', '#ffffff', '#ff00ff', '#00ffff'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden">
      {isHuge && (
         <motion.div 
           initial={{ opacity: 1, scale: 0 }}
           animate={{ opacity: 0, scale: 30 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute bg-orange-500 rounded-full w-32 h-32 blur-3xl opacity-80 mix-blend-screen"
         />
      )}
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.5);
        const distance = isHuge ? Math.random() * 1000 + 200 : Math.random() * 300 + 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sizePx = isHuge ? Math.random() * 40 + 10 : Math.random() * 15 + 5;
        const isStar = Math.random() > 0.5;
        
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{ x, y, scale: 0, opacity: 0, rotate: Math.random() * 720 - 360 }}
            transition={{ duration: isHuge ? 1.5 + Math.random() : 0.4 + Math.random() * 0.3, ease: "easeOut" }}
            className="absolute"
            style={{ 
               backgroundColor: isStar ? 'transparent' : color, 
               width: sizePx, 
               height: sizePx, 
               color: color,
               clipPath: isStar ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
               borderRadius: isStar ? '0%' : '50%',
               boxShadow: isStar ? 'none' : `0 0 10px ${color}`
            }}
          >
            {isStar && (
              <div style={{ backgroundColor: color, width: '100%', height: '100%' }} />
            )}
          </motion.div>
        );
      })}
      
      {isHuge && (
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-white"
         />
      )}
    </div>
  );
};

type QuestionType = 'multiple-choice' | 'text' | 'image-match' | 'audio-match' | 'video-match';

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  images?: string[];
  audios?: string[];
  mainImage?: string;
  chbdText?: string;
  videos?: string[];
}

// ============================================================================
// ИНСТРУКЦИЯ: КАК ИЗМЕНИТЬ ВОПРОСЫ И ТЕКСТ НА САЙТЕ
// ============================================================================
// Все вопросы и их настройки хранятся в массиве QUESTIONS ниже. 
// Чтобы изменить текст, вам нужно редактировать этот массив.
// 
// КАК ПОДКЛЮЧИТЬ СВОИ МЕДИАФАЙЛЫ:
// 1. Слева в панели файлов загрузите свои картинки в папку public/images
// 2. Загрузите видео в папку public/videos
// 3. Загрузите аудио в папку public/audios
// 4. В массиве ниже вместо ссылок вставьте пути к файлам. Например: '/images/photo.jpg'
// ============================================================================

const QUESTIONS: Question[] = [
  // ==================== БЛОК 1: ТЕСТОВЫЕ ВОПРОСЫ (1-5) ====================
  {
    id: 1,
    text: "Вопрос 1: Выбери правильный вариант",
    type: 'multiple-choice',
    options: ['Ответ 1', 'Ответ 2', 'Ответ 3'],
  },
  {
    id: 2,
    text: "Вопрос 2: Выбери правильный вариант",
    type: 'multiple-choice',
    options: ['Ответ 1', 'Ответ 2', 'Ответ 3'],
  },
  {
    id: 3,
    text: "Вопрос 3: Выбери правильный вариант",
    type: 'multiple-choice',
    options: ['Ответ 1', 'Ответ 2', 'Ответ 3'],
  },
  {
    id: 4,
    text: "Вопрос 4: Выбери правильный вариант",
    type: 'multiple-choice',
    options: ['Ответ 1', 'Ответ 2', 'Ответ 3'],
  },
  {
    id: 5,
    text: "Вопрос 5: Выбери правильный вариант",
    type: 'multiple-choice',
    options: ['Ответ 1', 'Ответ 2', 'Ответ 3'],
  },

  // ==================== БЛОК 2: ОТКРЫТЫЕ ВОПРОСЫ (6-10) ====================
  {
    id: 6,
    text: "Вопрос 6: Введи свой ответ",
    type: 'text',
  },
  {
    id: 7,
    text: "Вопрос 7: Введи свой ответ",
    type: 'text',
  },
  {
    id: 8,
    text: "Вопрос 8: Введи свой ответ",
    type: 'text',
  },
  {
    id: 9,
    text: "Вопрос 9: Введи свой ответ",
    type: 'text',
  },
  {
    id: 10,
    text: "Вопрос 10: Введи свой ответ",
    type: 'text',
  },

  // ==================== БЛОК 3: КАРТИНКИ (11-15) ====================
  {
    id: 11,
    text: "Вопрос 11: Сопоставь картинки (Выбери правильную)",
    type: 'image-match',
    images: [
      "https://placehold.co/100x100/8a2be2/ffffff?text=IMG+A11",
      "https://placehold.co/100x100/ff00ff/ffffff?text=IMG+B11",
      "https://placehold.co/100x100/1a0033/ffffff?text=IMG+C11",
    ],
  },
  {
    id: 12,
    text: "Вопрос 12: Сопоставь картинки (Выбери правильную)",
    type: 'image-match',
    images: [
      "https://placehold.co/100x100/8a2be2/ffffff?text=IMG+A12",
      "https://placehold.co/100x100/ff00ff/ffffff?text=IMG+B12",
      "https://placehold.co/100x100/1a0033/ffffff?text=IMG+C12",
    ],
  },
  {
    id: 13,
    text: "Вопрос 13: Сопоставь картинки (Выбери правильную)",
    type: 'image-match',
    images: [
      "https://placehold.co/100x100/8a2be2/ffffff?text=IMG+A13",
      "https://placehold.co/100x100/ff00ff/ffffff?text=IMG+B13",
      "https://placehold.co/100x100/1a0033/ffffff?text=IMG+C13",
    ],
  },
  {
    id: 14,
    text: "Вопрос 14: Сопоставь картинки (Выбери правильную)",
    type: 'image-match',
    images: [
      "https://placehold.co/100x100/8a2be2/ffffff?text=IMG+A14",
      "https://placehold.co/100x100/ff00ff/ffffff?text=IMG+B14",
      "https://placehold.co/100x100/1a0033/ffffff?text=IMG+C14",
    ],
  },
  {
    id: 15,
    text: "Вопрос 15: Сопоставь картинки (Выбери правильную)",
    type: 'image-match',
    images: [
      "https://placehold.co/100x100/8a2be2/ffffff?text=IMG+A15",
      "https://placehold.co/100x100/ff00ff/ffffff?text=IMG+B15",
      "https://placehold.co/100x100/1a0033/ffffff?text=IMG+C15",
    ],
  },

  // ==================== БЛОК 4: АУДИО (16-20) ====================
  {
    id: 16,
    text: "Вопрос 16: Прослушай и выбери звук",
    type: 'audio-match',
    audios: ['Звук 1', 'Звук 2', 'Звук 3'],
  },
  {
    id: 17,
    text: "Вопрос 17: Прослушай и выбери звук",
    type: 'audio-match',
    audios: ['Звук 1', 'Звук 2', 'Звук 3'],
  },
  {
    id: 18,
    text: "Вопрос 18: Прослушай и выбери звук",
    type: 'audio-match',
    audios: ['Звук 1', 'Звук 2', 'Звук 3'],
  },
  {
    id: 19,
    text: "Вопрос 19: Прослушай и выбери звук",
    type: 'audio-match',
    audios: ['Звук 1', 'Звук 2', 'Звук 3'],
  },
  {
    id: 20,
    text: "Вопрос 20: Прослушай и выбери звук",
    type: 'audio-match',
    audios: ['Звук 1', 'Звук 2', 'Звук 3'],
  },

  // ==================== БЛОК 5: ВИДЕО (ЧБД) (21-25) ====================
  {
    id: 21,
    text: "Вопрос 21: Посмотри видео и сделай выбор",
    type: 'video-match',
    mainImage: "https://placehold.co/400x250/1a0033/ffffff?text=ЧБД+КАРТИНКА+21",
    chbdText: "ЧБД",
    videos: ['Видео 1', 'Видео 2', 'Видео 3'],
  },
  {
    id: 22,
    text: "Вопрос 22: Посмотри видео и сделай выбор",
    type: 'video-match',
    mainImage: "https://placehold.co/400x250/1a0033/ffffff?text=ЧБД+КАРТИНКА+22",
    chbdText: "ЧБД",
    videos: ['Видео 1', 'Видео 2', 'Видео 3'],
  },
  {
    id: 23,
    text: "Вопрос 23: Посмотри видео и сделай выбор",
    type: 'video-match',
    mainImage: "https://placehold.co/400x250/1a0033/ffffff?text=ЧБД+КАРТИНКА+23",
    chbdText: "ЧБД",
    videos: ['Видео 1', 'Видео 2', 'Видео 3'],
  },
  {
    id: 24,
    text: "Вопрос 24: Посмотри видео и сделай выбор",
    type: 'video-match',
    mainImage: "https://placehold.co/400x250/1a0033/ffffff?text=ЧБД+КАРТИНКА+24",
    chbdText: "ЧБД",
    videos: ['Видео 1', 'Видео 2', 'Видео 3'],
  },
  {
    id: 25,
    text: "Вопрос 25: Посмотри видео и сделай выбор",
    type: 'video-match',
    mainImage: "https://placehold.co/400x250/1a0033/ffffff?text=ЧБД+КАРТИНКА+25",
    chbdText: "ЧБД",
    videos: ['Видео 1', 'Видео 2', 'Видео 3'],
  },
];

export default function App() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [webhookUrl, setWebhookUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitPhase, setIsSubmitPhase] = useState(false);
  const [explosion, setExplosion] = useState<{ id: number, size: 'mini' | 'huge' } | null>(null);
  const explosionIdRef = useRef(0);

  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const triggerExplosion = (size: 'mini' | 'huge') => {
    const id = ++explosionIdRef.current;
    setExplosion({ id, size });
    setTimeout(() => {
      setExplosion(prev => prev?.id === id ? null : prev);
    }, size === 'huge' ? 2000 : 800);
  };

  const handleAnswer = (id: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
  };

  const handleNext = () => {
    triggerExplosion('mini');
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsSubmitPhase(true);
    }
  };

  const handlePrev = () => {
    triggerExplosion('mini');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitToDiscord = async () => {
    if (!webhookUrl) {
      alert("Пожалуйста, введите Webhook URL Дискорда!");
      return;
    }

    triggerExplosion('huge');
    setLoading(true);

    // Wait for explosion effect to be visible
    await new Promise(resolve => setTimeout(resolve, 1000));

    const formattedAnswers = QUESTIONS.map(q => {
      const answer = answers[q.id] || "Нет ответа";
      return `**${q.text}**\n${answer}`;
    }).join('\n\n');

    const payload = {
      content: "📝 **Новый результат теста от K043GAR!**",
      embeds: [
        {
          title: "Результаты",
          description: formattedAnswers.substring(0, 4000), // Discord embed limit
          color: 0x8a2be2, // Purple
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Ошибка при отправке в Discord. Проверьте URL.");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке в Discord.");
    }
    setLoading(false);
  };

  const exportPdf = () => {
    if (!reportRef.current) return;

    const opt = {
      margin:       0.5,
      filename:     'k043gar_test_results.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(reportRef.current).save();
  };

  if (submitted) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
        <div className="y2k-panel w-full max-w-4xl p-6" ref={reportRef}>
          <div className="text-center mb-8 border-b-4 border-dotted pb-4" style={{ borderColor: '#9ca3af' }}>
            <h1 className="text-5xl md:text-7xl font-impact tracking-widest y2k-glow uppercase mb-2" style={{ color: '#8a2be2' }}>
              ВИЗУАЛЬНЫЙ ОТЧЕТ
            </h1>
            <p className="text-xl font-bold font-impact tracking-wide" style={{ color: '#374151' }}>by K043GAR</p>
          </div>

          <div className="y2k-panel-inner space-y-6">
            {QUESTIONS.map(q => (
              <div key={q.id} className="border-b-2 border-dashed pb-4" style={{ borderColor: '#d1d5db' }}>
                <p className="font-bold text-lg mb-2" style={{ color: '#000000' }}>{q.text}</p>
                <div className="p-3 border-2 inset-border rounded font-mono" style={{ backgroundColor: '#f3f4f6', borderColor: '#d1d5db', color: '#1e40af' }}>
                  {answers[q.id] || <span className="italic" style={{ color: '#ef4444' }}>Не отвечено</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button onClick={exportPdf} className="y2k-btn y2k-btn-purple px-6 py-3 text-xl flex items-center justify-center gap-2">
            <Download size={24} /> ЭКСПОРТ В PDF
          </button>
          <button onClick={() => setSubmitted(false)} className="y2k-btn px-6 py-3 text-xl justify-center">
            НАЗАД К ТЕСТУ
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <AnimatePresence>
        {explosion && <ExplosionEffect key={explosion.id} size={explosion.size} />}
      </AnimatePresence>

      {/* HEADER */}
      <div className="text-center mb-10 mt-4 relative">
        <div className="absolute -top-10 -left-10 text-y2k-pink animate-pulse opacity-50"><Sparkles size={64} /></div>
        <div className="absolute -bottom-5 -right-10 text-y2k-silver animate-spin-slow opacity-50"><Asterisk size={64} /></div>

        <div className="relative inline-block y2k-grain-container p-2">
          <h1 className="text-6xl md:text-8xl y2k-title mb-0 uppercase leading-none relative z-10">
            <WavyText text="ЗАГОЛОВОК" />
          </h1>
          <div className="inline-block bg-black px-4 py-1 border-2 border-y2k-pink transform -skew-x-12 mt-2 relative z-10">
            <div className="text-xl md:text-2xl font-impact tracking-widest text-white y2k-glow">
              <WavyText text="by K043GAR" />
            </div>
          </div>
        </div>
      </div>

      <div className="y2k-panel w-full max-w-4xl p-4 md:p-8">
        
        {/* WARNING BANNER */}
        <div className="bg-red-600 border-4 outset-border border-red-400 p-2 text-center text-white font-impact tracking-wider flex items-center justify-center gap-2 mb-8 uppercase text-xl md:text-2xl">
          <AlertTriangle /> PARENTAL ADVISORY EXPLICIT CONTENT <AlertTriangle />
        </div>

        {isSubmitPhase ? (
          <div className="text-center py-8">
            <h2 className="text-4xl font-impact text-y2k-dark mb-8 uppercase">ТЕСТ ЗАВЕРШЕН</h2>
            <p className="mb-8 font-bold text-gray-700 text-lg">Вы ответили на {Object.keys(answers).length} из {QUESTIONS.length} вопросов.</p>
            <div className="w-full max-w-md bg-gray-200 p-4 border-4 outset-border border-gray-400 text-center mx-auto mb-8">
              <label className="block font-impact text-lg mb-2 text-black">DISCORD WEBHOOK URL:</label>
              <input
                type="text"
                className="w-full y2k-input p-2 text-center font-mono text-sm"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => setIsSubmitPhase(false)} className="y2k-btn px-6 py-3 text-xl w-full md:w-auto">
                НАЗАД К ТЕСТУ
              </button>
              <button
                onClick={submitToDiscord}
                disabled={loading}
                className="y2k-btn y2k-btn-purple text-2xl px-8 py-3 flex items-center justify-center gap-3 w-full md:w-auto"
              >
                {loading ? 'ОТПРАВКА...' : (
                  <>
                    <Save size={24} /> ОТПРАВИТЬ <Send size={24} />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center text-y2k-dark font-impact text-xl border-b-2 border-dashed border-gray-400 pb-2">
              <span>ВОПРОС {currentQuestionIndex + 1} ИЗ {QUESTIONS.length}</span>
              <span>ПРОГРЕСС: {Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100)}%</span>
            </div>

            <div className="relative y2k-panel-inner group min-h-[300px]">
              {/* Decorative corner */}
              <div className="absolute -top-3 -left-3 bg-y2k-purple text-white font-impact w-10 h-10 flex items-center justify-center border-2 border-white rounded-full shadow-md z-10 text-xl">
                {currentQ.id}
              </div>

              <h2 className="text-xl md:text-2xl font-bold mb-6 ml-6 text-y2k-dark uppercase underline decoration-y2k-pink decoration-4 underline-offset-4">
                {currentQ.text}
              </h2>

              {/* Type 1: Multiple Choice */}
              {currentQ.type === 'multiple-choice' && (
                <div className="flex flex-col md:flex-row gap-4 ml-6">
                  {currentQ.options?.map(opt => (
                    <label key={opt} className={`flex-1 p-4 border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'bg-y2k-pink text-white border-black font-bold inset-border' : 'bg-gray-200 border-gray-400 hover:bg-gray-300 outset-border'}`}>
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={opt}
                        checked={answers[currentQ.id] === opt}
                        onChange={() => handleAnswer(currentQ.id, opt)}
                        className="sr-only"
                      />
                      <span className="font-impact tracking-wide text-xl text-center block w-full">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Type 2: Text Input */}
              {currentQ.type === 'text' && (
                <div className="ml-6">
                  <textarea
                    className="w-full y2k-input p-4 h-32 resize-none text-lg"
                    placeholder="Введи свой текст здесь..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  />
                </div>
              )}

              {/* Type 3: Image Match */}
              {currentQ.type === 'image-match' && (
                <div className="flex flex-wrap gap-4 ml-6 justify-center md:justify-start">
                  {currentQ.images?.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(currentQ.id, `Картинка ${idx + 1}`)}
                      className={`cursor-pointer border-4 p-2 ${answers[currentQ.id] === `Картинка ${idx + 1}` ? 'border-y2k-pink bg-y2k-pink inset-border' : 'border-gray-400 bg-gray-200 hover:border-gray-500 outset-border'}`}
                    >
                      <img src={img} alt={`Option ${idx + 1}`} className="w-32 h-32 object-cover border-2 border-black" />
                      <div className="text-center font-bold mt-2 text-sm bg-black text-white py-1">{idx + 1}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 4: Audio Match */}
              {currentQ.type === 'audio-match' && (
                <div className="flex flex-col md:flex-row gap-4 ml-6">
                  {currentQ.audios?.map((audio, idx) => (
                    <div key={idx} className="flex-1 bg-gray-200 p-4 border-2 outset-border border-gray-400 flex flex-col items-center gap-3">
                      <div className="w-full bg-black h-10 rounded-full flex items-center px-4 relative overflow-hidden">
                        <div className="h-2 bg-green-500 w-full opacity-50"></div>
                        <div className="absolute right-4 text-green-500 text-sm font-mono">0:00</div>
                      </div>
                      <button
                        onClick={() => handleAnswer(currentQ.id, audio)}
                        className={`y2k-btn px-4 py-2 w-full text-lg ${answers[currentQ.id] === audio ? 'bg-green-400 text-black border-green-600 inset-border' : ''}`}
                      >
                        {answers[currentQ.id] === audio ? 'ВЫБРАНО' : `ВЫБРАТЬ ${audio}`}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 5: Video Match (ЧБД) */}
              {currentQ.type === 'video-match' && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <img src={currentQ.mainImage} alt="Main" className="border-4 border-black max-w-full shadow-md w-full md:w-3/4 object-cover h-64" />
                  <h3 className="text-4xl font-impact tracking-widest text-black y2k-glow uppercase my-2 border-y-4 border-y2k-pink w-full text-center py-2 bg-y2k-silver">
                    {currentQ.chbdText}
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                    {currentQ.videos?.map((vid, idx) => (
                      <div key={idx} className="flex-1 bg-gray-200 p-2 border-2 outset-border border-gray-400">
                        <div className="bg-black h-24 mb-2 flex items-center justify-center text-white border-2 inset-border font-mono relative group cursor-pointer" onClick={() => setFullscreenVideo(vid)}>
                          <span className="opacity-100 group-hover:opacity-50 transition-opacity">▶ ВИДЕО 0{idx+1}.mpg</span>
                          <div className="absolute inset-0 bg-blue-500/20 hidden group-hover:block flex items-center justify-center"><span className="font-impact text-xl mt-4">ПОЛНЫЙ ЭКРАН</span></div>
                        </div>
                        <button
                          onClick={() => handleAnswer(currentQ.id, vid)}
                          className={`y2k-btn px-4 py-2 w-full text-sm ${answers[currentQ.id] === vid ? 'bg-y2k-pink text-white border-black inset-border' : ''}`}
                        >
                          {answers[currentQ.id] === vid ? 'ВЫБРАНО' : `ВЫБРАТЬ ${vid}`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-between mt-8 border-t-4 border-dashed border-gray-500 pt-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`y2k-btn px-6 py-3 text-xl flex items-center gap-2 ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowLeft size={24} /> НАЗАД
              </button>

              <button
                onClick={handleNext}
                className="y2k-btn y2k-btn-purple px-6 py-3 text-xl flex items-center gap-2"
              >
                {currentQuestionIndex === QUESTIONS.length - 1 ? 'ЗАВЕРШИТЬ' : 'СЛЕДУЮЩИЙ'} <ArrowRight size={24} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-y2k-silver text-xs font-mono text-center pb-8 opacity-50">
        © 2005 WRECKSHOP RECORDS INTERNET PRESENCE.<br/>
        BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800x600.
      </div>

      {fullscreenVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-gray-200 border-4 outset-border border-gray-400 p-2 flex flex-col shadow-[0_0_50px_rgba(255,0,255,0.5)]">
             <div className="flex justify-between items-center bg-[#000080] p-1 mb-2 border-2 outset-border border-gray-400 text-white">
               <span className="font-impact ml-2 tracking-widest">{fullscreenVideo.toUpperCase()}.MPG - WINDOWS MEDIA PLAYER</span>
               <button onClick={() => setFullscreenVideo(null)} className="y2k-btn px-2 py-0 border-2 outset-border border-gray-300 bg-gray-200 text-black font-bold">X</button>
             </div>
             <div className="w-full h-64 md:h-[500px] bg-black border-2 inset-border border-gray-600 flex items-center justify-center text-white relative">
               <div className="absolute inset-0 flex items-center justify-center flex-col animate-pulse">
                 <span className="text-6xl mb-4 text-y2k-pink">▶</span>
                 <span className="font-mono text-xl text-green-400">PLAYING: {fullscreenVideo}...</span>
               </div>
             </div>
             <div className="mt-2 flex items-center gap-2 bg-gray-300 p-2 border-2 inset-border border-gray-400">
                <button className="y2k-btn px-4 py-1">▶</button>
                <button className="y2k-btn px-4 py-1">⏸</button>
                <button className="y2k-btn px-4 py-1">⏹</button>
                <div className="flex-1 bg-black h-4 inset-border border-2 border-gray-500 relative mx-2">
                   <div className="absolute left-0 top-0 bottom-0 bg-blue-600 w-1/3"></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
