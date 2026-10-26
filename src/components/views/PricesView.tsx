'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
  Info,
  Check,
  Bot,
  Brain,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Target,
  Download,
  FileSpreadsheet,
  CheckCheck,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';

interface CommodityConfig {
  key: string;
  name: string;
  color: string;
  category: string;
  unit: string;
  description: string;
}

const COMMODITIES: CommodityConfig[] = [
  {
    key: 'طماطم',
    name: 'طماطم سلك فاخرة',
    color: '#16a34a', // Emerald Green (ContCrops theme)
    category: 'فريش',
    unit: 'كجم',
    description: 'سوق العبور والنوبارية',
  },
  {
    key: 'بطاطس تحمير',
    name: 'بطاطس تحمير (سبيونتا)',
    color: '#d97706', // Amber / Gold
    category: 'فريش',
    unit: 'كجم',
    description: 'محطات البحيرة والمنوفية',
  },
  {
    key: 'بصل أحمر',
    name: 'بصل أحمر تصدير',
    color: '#dc2626', // Red
    category: 'فريش',
    unit: 'كجم',
    description: 'مزارع الصعيد والدلتا',
  },
  {
    key: 'فراولة فريش',
    name: 'فراولة فريش (فرتونة)',
    color: '#e11d48', // Rose
    category: 'فريش / تصدير',
    unit: 'كجم',
    description: 'مزارع الإسماعيلية والقليوبية',
  },
  {
    key: 'برتقال صيفي',
    name: 'برتقال صيفي / فالنسيا',
    color: '#ea580c', // Orange
    category: 'موالح',
    unit: 'كجم',
    description: 'مزارع وادي النطرون',
  },
  {
    key: 'ثوم بلدي',
    name: 'ثوم بلدي ناشف',
    color: '#7c3aed', // Purple
    category: 'مجفف / تصدير',
    unit: 'كجم',
    description: 'محطات بني سويف والمنيا',
  },
];

interface WeeklyDataRow {
  period: string;
  dateRange: string;
  isForecast?: boolean;
  [commodity: string]: string | number | boolean | undefined;
}

const BASE_WEEKLY_PRICE_DATA: WeeklyDataRow[] = [
  {
    period: 'الأسبوع 1',
    dateRange: '1 - 7 أكتوبر',
    طماطم: 6.2,
    'بطاطس تحمير': 10.5,
    'بصل أحمر': 14.0,
    'فراولة فريش': 15.0,
    'برتقال صيفي': 8.0,
    'ثوم بلدي': 35.0,
  },
  {
    period: 'الأسبوع 2',
    dateRange: '8 - 14 أكتوبر',
    طماطم: 6.8,
    'بطاطس تحمير': 10.0,
    'بصل أحمر': 14.8,
    'فراولة فريش': 16.2,
    'برتقال صيفي': 8.5,
    'ثوم بلدي': 36.5,
  },
  {
    period: 'الأسبوع 3',
    dateRange: '15 - 21 أكتوبر',
    طماطم: 7.0,
    'بطاطس تحمير': 9.5,
    'بصل أحمر': 15.5,
    'فراولة فريش': 17.0,
    'برتقال صيفي': 9.0,
    'ثوم بلدي': 38.0,
  },
  {
    period: 'الأسبوع 4',
    dateRange: '22 - 28 أكتوبر',
    طماطم: 7.5,
    'بطاطس تحمير': 9.2,
    'بصل أحمر': 16.2,
    'فراولة فريش': 18.0,
    'برتقال صيفي': 9.2,
    'ثوم بلدي': 40.0,
  },
  {
    period: 'الأسبوع 5',
    dateRange: 'الأسبوع الحالي',
    طماطم: 8.0,
    'بطاطس تحمير': 9.0,
    'بصل أحمر': 16.0,
    'فراولة فريش': 18.5,
    'برتقال صيفي': 9.8,
    'ثوم بلدي': 42.0,
  },
];

const DAILY_PRICE_DATA: WeeklyDataRow[] = [
  {
    period: 'السبت',
    dateRange: 'يومي',
    طماطم: 7.4,
    'بطاطس تحمير': 9.3,
    'بصل أحمر': 15.8,
    'فراولة فريش': 17.6,
    'برتقال صيفي': 9.2,
    'ثوم بلدي': 40.8,
  },
  {
    period: 'الأحد',
    dateRange: 'يومي',
    طماطم: 7.5,
    'بطاطس تحمير': 9.2,
    'بصل أحمر': 15.9,
    'فراولة فريش': 17.8,
    'برتقال صيفي': 9.3,
    'ثوم بلدي': 41.0,
  },
  {
    period: 'الإثنين',
    dateRange: 'يومي',
    طماطم: 7.6,
    'بطاطس تحمير': 9.1,
    'بصل أحمر': 16.0,
    'فراولة فريش': 18.0,
    'برتقال صيفي': 9.4,
    'ثوم بلدي': 41.2,
  },
  {
    period: 'الثلاثاء',
    dateRange: 'يومي',
    طماطم: 7.7,
    'بطاطس تحمير': 9.0,
    'بصل أحمر': 16.1,
    'فراولة فريش': 18.2,
    'برتقال صيفي': 9.5,
    'ثوم بلدي': 41.5,
  },
  {
    period: 'الأربعاء',
    dateRange: 'يومي',
    طماطم: 7.8,
    'بطاطس تحمير': 9.0,
    'بصل أحمر': 16.0,
    'فراولة فريش': 18.3,
    'برتقال صيفي': 9.6,
    'ثوم بلدي': 41.7,
  },
  {
    period: 'الخميس',
    dateRange: 'يومي',
    طماطم: 7.9,
    'بطاطس تحمير': 8.9,
    'بصل أحمر': 16.0,
    'فراولة فريش': 18.5,
    'برتقال صيفي': 9.7,
    'ثوم بلدي': 42.0,
  },
  {
    period: 'الجمعة',
    dateRange: 'يومي',
    طماطم: 8.0,
    'بطاطس تحمير': 9.0,
    'بصل أحمر': 16.0,
    'فراولة فريش': 18.5,
    'برتقال صيفي': 9.8,
    'ثوم بلدي': 42.0,
  },
];

interface AIPredictionResult {
  cropName: string;
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidencePercent: number;
  trendDirection: string;
  changePercent: number;
  summaryRationale: string;
  keyDrivers: string[];
  recommendationForFarmers: string;
  recommendationForBuyers: string;
  source?: string;
}

export default function PricesView() {
  const { prices, addPrice } = useApp();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [crop, setCrop] = useState('');
  const [price, setPrice] = useState('');

  // Chart view modes
  const [chartMode, setChartMode] = useState<'multi' | 'single'>('single');
  const [timeframe, setTimeframe] = useState<'weekly' | 'daily'>('weekly');

  // Selected commodities to display in multi-line chart (keys)
  const [activeCommodityKeys, setActiveCommodityKeys] = useState<string[]>([
    'طماطم',
    'بطاطس تحمير',
    'بصل أحمر',
    'فراولة فريش',
  ]);

  // Selected single commodity for drill-down & AI forecast
  const [selectedSingleKey, setSelectedSingleKey] = useState<string>('طماطم');

  // AI Prediction state
  const [aiPredictions, setAiPredictions] = useState<Record<string, AIPredictionResult>>({});
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [showForecastOnChart, setShowForecastOnChart] = useState(true);

  // Selected single commodity metadata
  const singleCommodity = useMemo(() => {
    return (
      COMMODITIES.find((c) => c.key === selectedSingleKey) || COMMODITIES[0]
    );
  }, [selectedSingleKey]);

  // Fetch AI prediction for a commodity
  const fetchPrediction = useCallback(
    async (cropKey: string) => {
      setIsLoadingPrediction(true);
      try {
        const targetCommodity = COMMODITIES.find((c) => c.key === cropKey) || singleCommodity;
        const history = BASE_WEEKLY_PRICE_DATA.map((row) => ({
          period: row.period,
          dateRange: row.dateRange,
          price: Number(row[cropKey]) || 0,
        }));

        const res = await fetch('/api/prices/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropName: targetCommodity.name,
            category: targetCommodity.category,
            unit: targetCommodity.unit,
            history,
          }),
        });

        if (res.ok) {
          const data: AIPredictionResult = await res.json();
          setAiPredictions((prev) => ({
            ...prev,
            [cropKey]: data,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch AI price forecast:', err);
      } finally {
        setIsLoadingPrediction(false);
      }
    },
    [singleCommodity]
  );

  // Load initial AI forecast on mount for default crop
  useEffect(() => {
    if (mounted && !aiPredictions[selectedSingleKey]) {
      fetchPrediction(selectedSingleKey);
    }
  }, [mounted, selectedSingleKey, fetchPrediction, aiPredictions]);

  const currentAIPrediction = aiPredictions[selectedSingleKey];

  // Dynamic dataset that includes predicted week if enabled
  const currentDataset = useMemo(() => {
    if (timeframe === 'daily') {
      return DAILY_PRICE_DATA;
    }

    if (!showForecastOnChart || !currentAIPrediction) {
      return BASE_WEEKLY_PRICE_DATA;
    }

    // Append AI Forecast for Week 6
    const predictedRow: WeeklyDataRow = {
      period: 'الأسبوع 6 (توقع AI)',
      dateRange: 'توقع الأسبوع القادم',
      isForecast: true,
      [selectedSingleKey]: currentAIPrediction.predictedPrice,
    };

    // Also populate other commodities if predicted
    COMMODITIES.forEach((c) => {
      if (c.key !== selectedSingleKey && aiPredictions[c.key]) {
        predictedRow[c.key] = aiPredictions[c.key].predictedPrice;
      }
    });

    return [...BASE_WEEKLY_PRICE_DATA, predictedRow];
  }, [timeframe, showForecastOnChart, currentAIPrediction, selectedSingleKey, aiPredictions]);

  // Toggle commodity visibility in multi mode
  const toggleCommodity = (key: string) => {
    setActiveCommodityKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleAddPrice = () => {
    const num = parseFloat(price);
    if (!crop.trim() || isNaN(num)) return;
    addPrice(crop.trim(), num);
    setCrop('');
    setPrice('');
    setShowAddForm(false);
  };

  // Calculations for single commodity stats
  const singleStats = useMemo(() => {
    const values = BASE_WEEKLY_PRICE_DATA.map(
      (row) => Number(row[selectedSingleKey]) || 0
    );
    const first = values[0] || 0;
    const last = values[values.length - 1] || 0;
    const high = Math.max(...values);
    const low = Math.min(...values);
    const avg = values.reduce((acc, v) => acc + v, 0) / (values.length || 1);
    const changePercent = first > 0 ? ((last - first) / first) * 100 : 0;
    return {
      current: last,
      first,
      high,
      low,
      avg: Number(avg.toFixed(2)),
      changePercent: Number(changePercent.toFixed(1)),
      trend: changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'stable',
    };
  }, [selectedSingleKey]);

  // CSV Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Helper to escape CSV values for Excel & spreadsheet software
  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  // Trigger download with UTF-8 BOM so Arabic text is displayed properly in Microsoft Excel
  const triggerCSVDownload = (content: string, filename: string) => {
    const blob = new Blob(['\uFEFF' + content], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate and download CSV
  const handleExportCSV = (type: 'comprehensive' | 'single' | 'live' = 'comprehensive') => {
    let csvContent = '';
    let filename = '';
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (type === 'comprehensive') {
      filename = `contcrops-prices-history-all-${dateStr}.csv`;

      csvContent += `# منصة ContCrops الزراعية - التقرير الشامل لبيانات الأسعار التاريخية والتوقعات الذكية\n`;
      csvContent += `# تاريخ التصدير: ${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG')}\n`;
      csvContent += `# العملة: جنيه مصري (EGP) | دعم كامل للغة العربية (UTF-8 BOM) متوافق مع Excel وGoogle Sheets\n\n`;

      // SECTION 1: DETAILED TIME-SERIES PER COMMODITY
      csvContent += `### القسم الأول: السجل الزمني التفصيلي للمحاصيل الزراعية\n`;
      csvContent +=
        [
          'المحصول',
          'رمز السلعة',
          'القطاع الزراعي',
          'الوحدة',
          'الفترة الزمنية',
          'النطاق الزمني',
          'السعر (جنيه مصري)',
          'نوع البيانات',
          'الحد الأدنى المحتمل',
          'الحد الأقصى المحتمل',
          'نسبة الثقة %',
          'التغير عن الأسبوع السابق (جنيه)',
          'نسبة التغير %',
          'المحطة / السوق الجغرافي',
        ]
          .map(escapeCSV)
          .join(',') + '\n';

      COMMODITIES.forEach((commodity) => {
        let prevPrice: number | null = null;

        // 5 historical weeks
        BASE_WEEKLY_PRICE_DATA.forEach((row) => {
          const priceVal = row[commodity.key] as number;
          const diff =
            prevPrice !== null ? Number((priceVal - prevPrice).toFixed(2)) : 0;
          const pct =
            prevPrice !== null && prevPrice > 0
              ? Number(((diff / prevPrice) * 100).toFixed(1))
              : 0;
          prevPrice = priceVal;

          csvContent +=
            [
              commodity.name,
              commodity.key,
              commodity.category,
              commodity.unit,
              row.period,
              row.dateRange,
              priceVal.toFixed(2),
              'بيانات تاريخية فعلية',
              '-',
              '-',
              '-',
              diff > 0 ? `+${diff}` : String(diff),
              diff > 0 ? `+${pct}%` : `${pct}%`,
              commodity.description,
            ]
              .map(escapeCSV)
              .join(',') + '\n';
        });

        // Add AI prediction row if available for this commodity
        const pred = aiPredictions[commodity.key];
        if (pred) {
          const lastPrice =
            (BASE_WEEKLY_PRICE_DATA[BASE_WEEKLY_PRICE_DATA.length - 1][
              commodity.key
            ] as number) || 0;
          const diff = Number((pred.predictedPrice - lastPrice).toFixed(2));
          csvContent +=
            [
              commodity.name,
              commodity.key,
              commodity.category,
              commodity.unit,
              'الأسبوع 6 (توقع AI)',
              'الأسبوع القادم',
              pred.predictedPrice.toFixed(2),
              'توقع ذكاء اصطناعي (Gemini AI)',
              pred.minPrice.toFixed(2),
              pred.maxPrice.toFixed(2),
              `${pred.confidencePercent}%`,
              diff > 0 ? `+${diff}` : String(diff),
              pred.changePercent > 0
                ? `+${pred.changePercent}%`
                : `${pred.changePercent}%`,
              `${commodity.description} (نموذج التوقع الذكي)`,
            ]
              .map(escapeCSV)
              .join(',') + '\n';
        }
      });

      // SECTION 2: COMPARATIVE MATRIX TABLE
      csvContent += `\n### القسم الثاني: مصفوفة المقارنة الأسبوعية لجميع السلع (جنيه / كجم)\n`;
      const matrixHeaders = [
        'الفترة الزمنية',
        'النطاق الزمني',
        'نوع البيانات',
        ...COMMODITIES.map((c) => `${c.name} (${c.unit})`),
      ];
      csvContent += matrixHeaders.map(escapeCSV).join(',') + '\n';

      BASE_WEEKLY_PRICE_DATA.forEach((row) => {
        const rowVals = [
          row.period,
          row.dateRange,
          'بيانات تاريخية فعلية',
          ...COMMODITIES.map((c) =>
            ((row[c.key] as number) || 0).toFixed(2)
          ),
        ];
        csvContent += rowVals.map(escapeCSV).join(',') + '\n';
      });

      // Include AI projection row in matrix if any prediction exists
      const anyPredictions = Object.keys(aiPredictions).length > 0;
      if (anyPredictions) {
        const predRowVals = [
          'الأسبوع 6 (توقع AI)',
          'الأسبوع القادم',
          'توقع ذكاء اصطناعي',
          ...COMMODITIES.map((c) => {
            const pred = aiPredictions[c.key];
            return pred ? `${pred.predictedPrice.toFixed(2)} (توقع)` : '-';
          }),
        ];
        csvContent += predRowVals.map(escapeCSV).join(',') + '\n';
      }

      // SECTION 3: AI INSIGHTS & STRATEGIC RECOMMENDATIONS
      const predictionsList = Object.entries(aiPredictions);
      if (predictionsList.length > 0) {
        csvContent += `\n### القسم الثالث: تحليلات وتوصيات الذكاء الاصطناعي للأسبوع القادم\n`;
        csvContent +=
          [
            'المحصول',
            'السعر المتوقع',
            'نطاق السعر المتوقع',
            'الاتجاه المتوقع',
            'نسبة التغير %',
            'نسبة الثقة %',
            'التحليل الاقتصادي الزراعي',
            'توصية للمزارعين',
            'توصية للمصانع والمشترين',
          ]
            .map(escapeCSV)
            .join(',') + '\n';

        predictionsList.forEach(([cropKey, pred]) => {
          const comm = COMMODITIES.find((c) => c.key === cropKey);
          csvContent +=
            [
              comm ? comm.name : cropKey,
              `${pred.predictedPrice} جنيه`,
              `${pred.minPrice} - ${pred.maxPrice} جنيه`,
              pred.trendDirection,
              `${pred.changePercent}%`,
              `${pred.confidencePercent}%`,
              pred.summaryRationale,
              pred.recommendationForFarmers,
              pred.recommendationForBuyers,
            ]
              .map(escapeCSV)
              .join(',') + '\n';
        });
      }
    } else if (type === 'single') {
      const comm = singleCommodity;
      filename = `contcrops-price-${comm.key}-${dateStr}.csv`;

      csvContent += `# منصة ContCrops الزراعية - السجل التاريخي لمحصول: ${comm.name}\n`;
      csvContent += `# القطاع: ${comm.category} | الوحدة: ${comm.unit} | المحطة: ${comm.description}\n`;
      csvContent += `# تاريخ التصدير: ${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG')}\n\n`;

      csvContent +=
        [
          'الفترة',
          'النطاق الزمني',
          'السعر (جنيه مصري)',
          'نوع البيانات',
          'التغير (جنيه)',
          'نسبة التغير %',
          'ملاحظات',
        ]
          .map(escapeCSV)
          .join(',') + '\n';

      let prev: number | null = null;
      BASE_WEEKLY_PRICE_DATA.forEach((row) => {
        const val = row[comm.key] as number;
        const diff =
          prev !== null ? Number((val - prev).toFixed(2)) : 0;
        const pct =
          prev !== null && prev > 0
            ? Number(((diff / prev) * 100).toFixed(1))
            : 0;
        prev = val;

        csvContent +=
          [
            row.period,
            row.dateRange,
            val.toFixed(2),
            'تاريخي أسبوعي',
            diff > 0 ? `+${diff}` : String(diff),
            diff > 0 ? `+${pct}%` : `${pct}%`,
            'متوسط سوق الجملة والمزارع',
          ]
            .map(escapeCSV)
            .join(',') + '\n';
      });

      // AI forecast if exists
      const pred = aiPredictions[comm.key];
      if (pred) {
        const lastPrice =
          (BASE_WEEKLY_PRICE_DATA[BASE_WEEKLY_PRICE_DATA.length - 1][
            comm.key
          ] as number) || 0;
        const diff = Number((pred.predictedPrice - lastPrice).toFixed(2));
        csvContent +=
          [
            'الأسبوع 6 (توقع AI)',
            'الأسبوع القادم',
            pred.predictedPrice.toFixed(2),
            'توقع ذكاء اصطناعي (Gemini)',
            diff > 0 ? `+${diff}` : String(diff),
            pred.changePercent > 0
              ? `+${pred.changePercent}%`
              : `${pred.changePercent}%`,
            `نطاق متوقع (${pred.minPrice} - ${pred.maxPrice})، ثقة ${pred.confidencePercent}%`,
          ]
            .map(escapeCSV)
            .join(',') + '\n';
      }

      // Add daily data for this crop
      csvContent += `\n### تفصيل الأسعار اليومية لآخر 7 أيام للمحصول:\n`;
      csvContent +=
        ['اليوم', 'الفترة', 'السعر (جنيه مصري)']
          .map(escapeCSV)
          .join(',') + '\n';
      DAILY_PRICE_DATA.forEach((d) => {
        const val = d[comm.key] as number;
        csvContent +=
          [d.period, d.dateRange, val ? val.toFixed(2) : '-']
            .map(escapeCSV)
            .join(',') + '\n';
      });
    } else if (type === 'live') {
      filename = `contcrops-live-prices-${dateStr}.csv`;
      csvContent += `# منصة ContCrops الزراعية - جدول الأسعار اللحظية المباشرة\n`;
      csvContent += `# تاريخ التصدير: ${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG')}\n\n`;

      csvContent +=
        [
          'المحصول',
          'القطاع الزراعي',
          'سعر اليوم (جنيه)',
          'الوحدة',
          'المصدر / السوق',
          'التغير اليومي',
        ]
          .map(escapeCSV)
          .join(',') + '\n';

      prices.forEach((item) => {
        csvContent +=
          [
            item.crop,
            item.cat,
            item.price,
            item.unit || 'كجم',
            item.source || 'سوق العبور',
            item.change > 0 ? `+${item.change}` : String(item.change),
          ]
            .map(escapeCSV)
            .join(',') + '\n';
      });
    }

    triggerCSVDownload(csvContent, filename);
    setShowExportModal(false);
    setExportSuccessMessage(`تم تنزيل ملف (${filename}) بتنسيق CSV بنجاح! جاهز للفتح في Excel أو Google Sheets.`);
    setTimeout(() => {
      setExportSuccessMessage(null);
    }, 5000);
  };

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
        {/* Success Toast for CSV Download */}
        {exportSuccessMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-bold shrink-0">
                <CheckCheck size={18} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-emerald-950">
                  تم تنزيل ملف البيانات بنجاح
                </div>
                <div className="text-xs text-emerald-700 mt-0.5">
                  {exportSuccessMessage}
                </div>
              </div>
            </div>
            <button
              onClick={() => setExportSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 rounded-lg hover:bg-emerald-100/50 cursor-pointer transition"
              title="إغلاق"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-100 border border-green-200 rounded-full text-xs font-bold text-green-800 mb-2">
              <Sparkles size={14} className="text-[#16a34a] animate-pulse" />
              <span>ميزة ذكاء اصطناعي: توقعات الأسعار مدعومة بنموذج Gemini</span>
            </div>
            <h1 className="text-[28px] font-extrabold flex items-center gap-2">
              <Activity size={26} className="text-[#16a34a]" />
              <span>مؤشرات وبورصة الأسعار والتوقعات الذكية</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              متابعة حركة الأسعار الأسبوعية واليومية مع إمكانية تنزيل البيانات التاريخية بصيغة CSV والتنبؤ بأسعار الأسبوع القادم
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* CSV Download Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="h-10 px-4 bg-white border border-gray-200 text-gray-700 hover:text-[#16a34a] hover:border-emerald-300 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-emerald-50/40 transition cursor-pointer shadow-sm"
              title="تنزيل بيانات الأسعار التاريخية بتنسيق CSV"
            >
              <Download size={16} className="text-[#16a34a]" />
              <span>تحميل البيانات (CSV)</span>
            </button>

            <button
              onClick={() => fetchPrediction(selectedSingleKey)}
              disabled={isLoadingPrediction}
              className="h-10 px-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-95 cursor-pointer shadow-sm disabled:opacity-50 transition"
            >
              {isLoadingPrediction ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Bot size={16} />
              )}
              <span>تحديث توقع AI للأسبوع القادم</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="h-10 px-4 bg-white border border-gray-100 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>إضافة سعر جديد</span>
            </button>
          </div>
        </div>

        {/* Add price modal/drawer */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="text-xs font-bold text-gray-600">المحصول</label>
              <input
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="مثال: خيار بلدي"
                className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-bold text-gray-600">السعر (جنيه / كجم)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="7.5"
                className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
              />
            </div>
            <button
              onClick={handleAddPrice}
              className="h-10 px-6 bg-[#16a34a] text-white rounded-full font-bold text-sm hover:bg-[#15803d] transition cursor-pointer"
            >
              حفظ وتحديث
            </button>
          </div>
        )}

        {/* DYNAMIC RECHARTS LINE CHART CONTAINER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6 space-y-5">
          {/* Top Controls: Mode & Timeframe */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center font-bold">
                <LineChartIcon size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-[17px] text-gray-900 flex items-center gap-2">
                  <span>منحنى اتجاهات وتوقعات الأسعار (Dynamic Line Chart)</span>
                  {showForecastOnChart && currentAIPrediction && timeframe === 'weekly' && (
                    <span className="text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Sparkles size={11} />
                      <span>يتضمن نقطة الأسبوع 6 المتوقعة</span>
                    </span>
                  )}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  رسم بياني خطي دقيق يوضح مسار السلع عبر الأسابيع مع إسقاط مستقبلي للأسبوع القادم
                </div>
              </div>
            </div>

            {/* Timeframe & Display Mode Switchers */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Forecast Toggle Button */}
              {timeframe === 'weekly' && currentAIPrediction && (
                <button
                  onClick={() => setShowForecastOnChart(!showForecastOnChart)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    showForecastOnChart
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Brain size={14} className={showForecastOnChart ? 'text-[#16a34a]' : ''} />
                  <span>{showForecastOnChart ? 'إخفاء توقع AI' : 'إظهار توقع AI على الرسم'}</span>
                </button>
              )}

              {/* Timeframe switch */}
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-xs font-bold">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    timeframe === 'weekly'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  أسبوعياً (٥ أسابيع + توقع)
                </button>
                <button
                  onClick={() => setTimeframe('daily')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    timeframe === 'daily'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  يومياً (٧ أيام)
                </button>
              </div>

              {/* Multi vs Single Mode */}
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-xs font-bold">
                <button
                  onClick={() => setChartMode('single')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    chartMode === 'single'
                      ? 'bg-[#16a34a] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>محصول محدد مع التوقع</span>
                </button>
                <button
                  onClick={() => setChartMode('multi')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    chartMode === 'multi'
                      ? 'bg-[#16a34a] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers size={13} />
                  <span>مقارنة المحاصيل</span>
                </button>
              </div>

              {/* Quick CSV Export Button */}
              <button
                onClick={() => handleExportCSV('comprehensive')}
                title="تحميل البيانات التاريخية بتنسيق CSV"
                className="h-9 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-white border border-gray-200 text-gray-700 hover:text-emerald-700 hover:border-emerald-300 shadow-xs"
              >
                <Download size={13} className="text-[#16a34a]" />
                <span>تصدير CSV</span>
              </button>
            </div>
          </div>

          {/* Commodity Filters / Selector Chips */}
          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 flex items-center justify-between">
              <span>
                {chartMode === 'multi'
                  ? 'اختر المحاصيل المراد عرضها على المنحنى البياني:'
                  : 'اختر المحصول للتحليل وعرض توقع الذكاء الاصطناعي:'}
              </span>
              {chartMode === 'multi' && (
                <span className="text-[11px] text-gray-400">
                  المفعل حالياً: {activeCommodityKeys.length} من {COMMODITIES.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {COMMODITIES.map((c) => {
                const isSelected =
                  chartMode === 'multi'
                    ? activeCommodityKeys.includes(c.key)
                    : selectedSingleKey === c.key;

                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      if (chartMode === 'multi') {
                        toggleCommodity(c.key);
                      } else {
                        setSelectedSingleKey(c.key);
                      }
                    }}
                    className={`h-9 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border shrink-0 ${
                      isSelected
                        ? 'bg-white border-gray-300 shadow-xs ring-2'
                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 opacity-60'
                    }`}
                    style={{
                      borderColor: isSelected ? c.color : undefined,
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex items-center justify-center text-white text-[8px]"
                      style={{ backgroundColor: c.color }}
                    >
                      {isSelected && <Check size={8} strokeWidth={3} />}
                    </span>
                    <span className="text-gray-900">{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({c.category})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          {chartMode === 'single' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3.5">
                <div className="text-[11px] text-gray-400 font-bold">السعر الراهن (الأسبوع 5)</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-[#16a34a]">
                    {singleStats.current} ج
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-bold ${
                      singleStats.trend === 'up'
                        ? 'text-green-600'
                        : singleStats.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {singleStats.trend === 'up' && <ArrowUpRight size={14} />}
                    {singleStats.trend === 'down' && <ArrowDownRight size={14} />}
                    {singleStats.trend === 'stable' && <Minus size={14} />}
                    {singleStats.changePercent > 0 ? '+' : ''}
                    {singleStats.changePercent}%
                  </span>
                </div>
              </div>

              <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3.5">
                <div className="text-[11px] text-gray-400 font-bold">أعلى سعر مسجل</div>
                <div className="mt-1 text-xl font-extrabold text-gray-800">
                  {singleStats.high} ج / {singleCommodity.unit}
                </div>
              </div>

              <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3.5">
                <div className="text-[11px] text-gray-400 font-bold">أدنى سعر مسجل</div>
                <div className="mt-1 text-xl font-extrabold text-gray-800">
                  {singleStats.low} ج / {singleCommodity.unit}
                </div>
              </div>

              <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-3.5">
                <div className="text-[11px] text-green-700 font-bold flex items-center justify-between">
                  <span>توقع AI للأسبوع القادم</span>
                  <Sparkles size={12} className="text-[#16a34a]" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-[#15803d]">
                    {currentAIPrediction ? `${currentAIPrediction.predictedPrice} ج` : 'جاري التحليل...'}
                  </span>
                  {currentAIPrediction && (
                    <span
                      className={`text-xs font-bold ${
                        currentAIPrediction.changePercent >= 0
                          ? 'text-emerald-700'
                          : 'text-red-600'
                      }`}
                    >
                      {currentAIPrediction.changePercent > 0 ? '+' : ''}
                      {currentAIPrediction.changePercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f0fdf4] border border-green-100 rounded-xl p-3">
                <div className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                  <ArrowUpRight size={13} />
                  <span>أعلى صعود أسبوعي</span>
                </div>
                <div className="mt-1 font-extrabold text-sm text-gray-900">
                  طماطم سلك (+29.0%)
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">من 6.2 ج إلى 8.0 ج</div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="text-[11px] text-red-700 font-bold flex items-center gap-1">
                  <ArrowDownRight size={13} />
                  <span>أكبر تصحيح سعري</span>
                </div>
                <div className="mt-1 font-extrabold text-sm text-gray-900">
                  بطاطس تحمير (-14.3%)
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">من 10.5 ج إلى 9.0 ج</div>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                <div className="text-[11px] text-purple-700 font-bold flex items-center gap-1">
                  <Activity size={13} />
                  <span>الأعلى قيمة تصديرية</span>
                </div>
                <div className="mt-1 font-extrabold text-sm text-gray-900">
                  ثوم بلدي (42.0 ج/كجم)
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">طلب مرتفع للتصدير</div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                <div className="text-[11px] text-sky-700 font-bold flex items-center gap-1">
                  <Calendar size={13} />
                  <span>مؤشر استقرار السوق</span>
                </div>
                <div className="mt-1 font-extrabold text-sm text-gray-900">
                  88.5% متوازن
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">تذبذب طبيعي وموسمي</div>
              </div>
            </div>
          )}

          {/* THE RECHARTS LINE CHART */}
          <div className="h-[340px] w-full pt-3">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={currentDataset}
                  margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Tajawal' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Tajawal' }}
                    domain={['dataMin - 1', 'dataMax + 2']}
                    unit=" ج"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const rowData = payload[0]?.payload as WeeklyDataRow | undefined;
                        const isForecast = rowData?.isForecast;
                        return (
                          <div className="bg-gray-900 text-white rounded-2xl p-3.5 shadow-xl border border-gray-800 text-right text-xs min-w-[220px]">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                              <span className="font-extrabold text-sm text-gray-100 flex items-center gap-1.5">
                                {isForecast && <Sparkles size={13} className="text-emerald-400" />}
                                <span>{label}</span>
                              </span>
                              {isForecast ? (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                  توقع الذكاء الاصطناعي
                                </span>
                              ) : (
                                rowData?.dateRange && (
                                  <span className="text-[10px] text-gray-400">
                                    {rowData.dateRange}
                                  </span>
                                )
                              )}
                            </div>
                            <div className="space-y-1.5">
                              {payload.map((item) => {
                                const commodity = COMMODITIES.find(
                                  (c) => c.key === item.dataKey
                                );
                                return (
                                  <div
                                    key={String(item.dataKey)}
                                    className="flex items-center justify-between gap-3"
                                  >
                                    <span className="flex items-center gap-1.5 text-gray-300">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                      />
                                      <span>{commodity?.name || item.name}:</span>
                                    </span>
                                    <span className="font-bold text-white">
                                      {item.value} ج / كجم
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {isForecast && currentAIPrediction && (
                              <div className="mt-2.5 pt-2 border-t border-gray-800 text-[10px] text-emerald-300">
                                نطاق متوقع: {currentAIPrediction.minPrice} إلى {currentAIPrediction.maxPrice} ج (ثقة {currentAIPrediction.confidencePercent}%)
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {chartMode === 'multi' && (
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{
                        paddingBottom: 12,
                        fontSize: 12,
                        fontFamily: 'Tajawal',
                        direction: 'rtl',
                      }}
                    />
                  )}

                  {/* Visual separation for the AI Forecast point */}
                  {timeframe === 'weekly' && showForecastOnChart && currentAIPrediction && (
                    <ReferenceLine
                      x="الأسبوع 5"
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'توقع AI ➔',
                        fill: '#10b981',
                        fontSize: 11,
                        position: 'insideTopLeft',
                      }}
                    />
                  )}

                  {/* Single Mode Reference Lines for Min and Max */}
                  {chartMode === 'single' && (
                    <>
                      <ReferenceLine
                        y={singleStats.high}
                        stroke="#16a34a"
                        strokeDasharray="3 3"
                        label={{
                          value: `الأعلى: ${singleStats.high} ج`,
                          fill: '#16a34a',
                          fontSize: 11,
                          position: 'top',
                        }}
                      />
                      <ReferenceLine
                        y={singleStats.low}
                        stroke="#dc2626"
                        strokeDasharray="3 3"
                        label={{
                          value: `الأدنى: ${singleStats.low} ج`,
                          fill: '#dc2626',
                          fontSize: 11,
                          position: 'bottom',
                        }}
                      />
                    </>
                  )}

                  {/* Render Lines Dynamically */}
                  {chartMode === 'multi' ? (
                    COMMODITIES.filter((c) => activeCommodityKeys.includes(c.key)).map(
                      (c) => (
                        <Line
                          key={c.key}
                          type="monotone"
                          dataKey={c.key}
                          name={c.name}
                          stroke={c.color}
                          strokeWidth={2.8}
                          dot={{
                            r: 4,
                            fill: '#fff',
                            stroke: c.color,
                            strokeWidth: 2,
                          }}
                          activeDot={{
                            r: 6,
                            fill: c.color,
                            stroke: '#fff',
                            strokeWidth: 2,
                          }}
                          animationDuration={800}
                        />
                      )
                    )
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={singleCommodity.key}
                      name={singleCommodity.name}
                      stroke={singleCommodity.color}
                      strokeWidth={3.5}
                      dot={{
                        r: 5,
                        fill: '#fff',
                        stroke: singleCommodity.color,
                        strokeWidth: 2.5,
                      }}
                      activeDot={{
                        r: 8,
                        fill: singleCommodity.color,
                        stroke: '#fff',
                        strokeWidth: 2.5,
                      }}
                      animationDuration={800}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400">
                جاري إعداد المنحنى البياني...
              </div>
            )}
          </div>

          {/* Chart footer insights */}
          <div className="pt-3 border-t border-gray-50 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
            <div className="flex items-center gap-1.5">
              <Info size={13} className="text-[#16a34a]" />
              <span>
                البيانات التاريخية مستخرجة من متوسطات أسواق الجملة المركزية، ونقطة الأسبوع 6 محسوبة بواسطة نموذج التوقع الذكي.
              </span>
            </div>
            <div className="font-bold text-gray-600">
              الوحدة: جنيه مصري / كيلوجرام
            </div>
          </div>
        </div>

        {/* AI PREDICTION COMPREHENSIVE CARD (FEATURE REQUEST) */}
        <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden border border-emerald-800/40">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Header of AI Panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <Brain size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight">
                      توقعات الأسعار الذكية للأسبوع القادم (Gemini AI Forecasting)
                    </h2>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      مباشر
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/70 mt-0.5">
                    تحليل وتنبؤ ذكي يعتمد على السلسلة الزمنية لحركة التداول التاريخية ومواسم الإنتاج
                  </p>
                </div>
              </div>

              {/* Commodity Selector within AI Card */}
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur border border-white/10 rounded-2xl p-1.5">
                <span className="text-xs text-emerald-300 font-bold px-2">
                  المحصول المختار:
                </span>
                <select
                  value={selectedSingleKey}
                  onChange={(e) => {
                    const newCrop = e.target.value;
                    setSelectedSingleKey(newCrop);
                    fetchPrediction(newCrop);
                  }}
                  className="bg-emerald-950 border border-emerald-700/50 text-white text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-emerald-400"
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => fetchPrediction(selectedSingleKey)}
                  disabled={isLoadingPrediction}
                  title="إعادة التوليد"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={isLoadingPrediction ? 'animate-spin' : ''}
                  />
                </button>
              </div>
            </div>

            {/* Main AI Forecast Content */}
            {isLoadingPrediction ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 size={36} className="text-emerald-400 animate-spin" />
                <div className="text-base font-bold text-white">
                  جاري تحليل تاريخ الأسعار بواسطة الذكاء الاصطناعي...
                </div>
                <div className="text-xs text-emerald-200/60 max-w-md">
                  نقوم بمعالجة نقاط الأسعار للأسابيع الخمسة الماضية وربطها بالمتغيرات الموسمية وطلب مصانع التصدير
                </div>
              </div>
            ) : currentAIPrediction ? (
              <div className="space-y-6">
                {/* 4 Stat Metric Cards in dark modern styling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Predicted Price Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur hover:bg-white/10 transition">
                    <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
                      <span>السعر المتوقع للأسبوع القادم</span>
                      <Target size={14} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {currentAIPrediction.predictedPrice}
                      </span>
                      <span className="text-sm font-bold text-emerald-300">
                        جنيه / {singleCommodity.unit}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          currentAIPrediction.changePercent >= 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {currentAIPrediction.changePercent >= 0 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        <span>
                          {currentAIPrediction.changePercent > 0 ? '+' : ''}
                          {currentAIPrediction.changePercent}% متوقع
                        </span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        مقارنة بالسعر الحالي ({singleStats.current} ج)
                      </span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur hover:bg-white/10 transition">
                    <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
                      <span>النطاق السعري المتوقع</span>
                      <Activity size={14} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {currentAIPrediction.minPrice} - {currentAIPrediction.maxPrice}
                      </span>
                      <span className="text-xs font-bold text-gray-300">ج</span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-200/70">
                      نطاق التذبذب الطبيعي بناءً على العرض والطلب
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur hover:bg-white/10 transition">
                    <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
                      <span>درجة موثوقية التوقع</span>
                      <ShieldCheck size={14} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {currentAIPrediction.confidencePercent}%
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        ثقة عالية
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-200/70">
                      محسوبة استناداً لاستقرار السلسلة الزمنية
                    </div>
                  </div>

                  {/* Trend Direction */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur hover:bg-white/10 transition">
                    <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
                      <span>الاتجاه العام للسوق</span>
                      <TrendingUp size={14} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {currentAIPrediction.trendDirection}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-200/70">
                      {currentAIPrediction.changePercent > 0
                        ? 'زيادة في وتيرة الشراء'
                        : currentAIPrediction.changePercent < 0
                        ? 'وفرة في المعروض الموسمي'
                        : 'توازن بين الطلب والمعروض'}
                    </div>
                  </div>
                </div>

                {/* Analysis Rationale & Key Drivers Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Economic Rationale */}
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-5 backdrop-blur">
                    <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-sm">
                      <Sparkles size={16} />
                      <span>قراءة وتحليل الذكاء الاصطناعي لحركة {singleCommodity.name}:</span>
                    </div>
                    <p className="text-xs leading-6 text-gray-200 whitespace-pre-line">
                      {currentAIPrediction.summaryRationale}
                    </p>
                  </div>

                  {/* Key Drivers */}
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-5 backdrop-blur">
                    <div className="flex items-center gap-2 mb-3 text-emerald-300 font-bold text-sm">
                      <Activity size={16} />
                      <span>أبرز المحركات السوقية المؤثرة على السعر:</span>
                    </div>
                    <ul className="space-y-2">
                      {currentAIPrediction.keyDrivers.map((driver, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-gray-200 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations Split: Farmers vs Buyers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Farmers Advice */}
                  <div className="bg-emerald-950/60 border border-emerald-600/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1.5">
                      <span>🌾 توجيهات عملية للمزارعين وأصحاب الأراضي:</span>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-6">
                      {currentAIPrediction.recommendationForFarmers}
                    </p>
                  </div>

                  {/* Buyers & Exporters Advice */}
                  <div className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-sky-300 font-bold text-sm mb-1.5">
                      <span>🏭 توجيهات لمصانع الأغذية وشركات التصدير:</span>
                    </div>
                    <p className="text-xs text-sky-100/90 leading-6">
                      {currentAIPrediction.recommendationForBuyers}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-emerald-200/60">
                اضغط على زر "تحديث توقع AI للأسبوع القادم" لبدء الحساب
              </div>
            )}
          </div>
        </div>

        {/* Existing Live Prices Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[16px] text-gray-900">
                جدول الأسعار اليومي المباشر
              </span>
              <div className="text-xs text-gray-500 mt-0.5">
                قائمة الأسعار المباشرة حسب آخر معاملات مزارعي وتجار ContCrops
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('live')}
                className="text-xs bg-white text-gray-700 hover:text-emerald-700 px-3 py-1.5 rounded-full border border-gray-200 font-bold flex items-center gap-1.5 transition cursor-pointer hover:border-emerald-300 shadow-xs"
                title="تنزيل جدول الأسعار اللحظية بتنسيق CSV"
              >
                <Download size={13} className="text-[#16a34a]" />
                <span>تحميل الجدول (CSV)</span>
              </button>
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 font-bold">
                تحديث لحظي
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-right py-3.5 px-5 font-bold">المحصول</th>
                  <th className="text-right py-3.5 px-5 font-bold">القطاع</th>
                  <th className="text-right py-3.5 px-5 font-bold">سعر اليوم</th>
                  <th className="text-right py-3.5 px-5 font-bold">المصدر</th>
                  <th className="text-right py-3.5 px-5 font-bold">التغير اليومي</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="py-3 px-5 font-bold text-gray-900">{item.crop}</td>
                    <td className="py-3 px-5">
                      <span className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-700 font-medium">
                        {item.cat}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-extrabold text-[#16a34a]">
                      {item.price} ج / {item.unit || 'كجم'}
                    </td>
                    <td className="py-3 px-5 text-xs text-gray-500">
                      {item.source || 'سوق العبور'}
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          item.change > 0
                            ? 'bg-green-50 text-green-700'
                            : item.change < 0
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {item.change > 0 ? (
                          <TrendingUp size={12} />
                        ) : item.change < 0 ? (
                          <TrendingDown size={12} />
                        ) : null}
                        {item.change > 0 ? '+' : ''}
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV EXPORT MODAL */}
        {showExportModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowExportModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-7 shadow-2xl border border-gray-100 relative space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <span>تحميل بيانات الأسعار الزراعية</span>
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        CSV / Excel
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ملف بصيغة CSV متوافق 100% مع Excel وGoogle Sheets مع دعم كامل للغة العربية (ترميز UTF-8 BOM)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Download Options */}
              <div className="space-y-3">
                {/* Option 1: Comprehensive */}
                <div
                  onClick={() => handleExportCSV('comprehensive')}
                  className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-105 transition">
                    <Download size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-950">
                        التقرير التاريخي الشامل لجميع السلع (موصى به)
                      </span>
                      <span className="text-[10px] font-bold bg-[#16a34a] text-white px-2 py-0.5 rounded-full">
                        الأشمل
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      يشمل السجلات الأسبوعية للمحاصيل الستة، مصفوفة المقارنة الأسبوعية، وتوقعات الذكاء الاصطناعي مع التوصيات الاستراتيجية للمزارعين والمصانع.
                    </p>
                  </div>
                </div>

                {/* Option 2: Single crop */}
                <div
                  onClick={() => handleExportCSV('single')}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:bg-gray-50 transition cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-emerald-100 text-gray-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 transition">
                    <Download size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 group-hover:text-emerald-950">
                        بيانات المحصول المختار: {singleCommodity.name}
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                        أسبوعي + يومي
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      تنزيل السجل التاريخي الكامل لـ {singleCommodity.name} عبر 5 أسابيع سابقة بالإضافة إلى بيانات الـ 7 أيام الأخيرة وتوقع الأسبوع القادم.
                    </p>
                  </div>
                </div>

                {/* Option 3: Live Table */}
                <div
                  onClick={() => handleExportCSV('live')}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:bg-gray-50 transition cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-emerald-100 text-gray-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 transition">
                    <Download size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 group-hover:text-emerald-950">
                        جدول الأسعار اللحظية المباشرة
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                        سوق اليوم
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      تنزيل جدول أسعار المعاملات اللحظية المباشرة المسجلة في بورصة ContCrops مع الأسواق والمصادر وفروق التغير اليومي.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck size={14} className="text-[#16a34a]" />
                  <span>تنسيق CSV نظيف جاهز للتحليل في Python, Excel, Pandas, أو PowerBI</span>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
