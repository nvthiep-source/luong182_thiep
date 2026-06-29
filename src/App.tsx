import React, { useState, useEffect, useRef } from "react";
import { 
  Calculator, 
  FileDown, 
  Copy, 
  Check, 
  RotateCcw, 
  Info, 
  Award, 
  ChevronRight,
  ShieldAlert, 
  Percent, 
  Coins, 
  Briefcase, 
  MapPin, 
  TrendingUp,
  FileText,
  Sparkles,
  Github
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for inputs
interface SalaryInputs {
  luongCoSo: number;
  doiTuong: string;
  heSoLuong: number | string;
  pcUuDaiPct: number | string;
  pcChucVuHeSo: number | string;
  pcKhuVucHeSo: number | string;
  pcThamNienPct: number | string;
  pcVuotKhungPct: number | string;
}

// Result item interface
interface SalaryResult {
  luongChinh: number;
  pcUuDai: number;
  pcChucVu: number;
  pcKhuVuc: number;
  pcVuotKhung: number;
  pcThamNien: number;
  tongLuongGop: number;
  coSoTinhBH: number;
  truBHYT: number;
  truBHXHBHTN: number;
  thucNhan: number;
}

export default function App() {
  // Input states
  const [inputs, setInputs] = useState<SalaryInputs>({
    luongCoSo: 2340000,
    doiTuong: "mamnon_tieuhoc",
    heSoLuong: 0,
    pcUuDaiPct: 35,
    pcChucVuHeSo: 0.0,
    pcKhuVucHeSo: 0.0,
    pcThamNienPct: 0,
    pcVuotKhungPct: 0,
  });

  const [isCalculated, setIsCalculated] = useState(true);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [themeMode, setThemeMode] = useState<"cream" | "slate">("cream");
  const [isCustomPcChucVu, setIsCustomPcChucVu] = useState(false);

  // State to hold output results
  const [result, setResult] = useState<SalaryResult>({
    luongChinh: 0,
    pcUuDai: 0,
    pcChucVu: 0,
    pcKhuVuc: 0,
    pcVuotKhung: 0,
    pcThamNien: 0,
    tongLuongGop: 0,
    coSoTinhBH: 0,
    truBHYT: 0,
    truBHXHBHTN: 0,
    thucNhan: 0,
  });

  // Calculate whenever inputs/modes change, or specifically on button click
  const performCalculation = (currentInputs: SalaryInputs) => {
    const lcs = Number(currentInputs.luongCoSo) || 0;
    const hsl = Number(currentInputs.heSoLuong) || 0;
    const pcUuDaiPct = Number(currentInputs.pcUuDaiPct) || 0;
    const pcChucVuHeSo = Number(currentInputs.pcChucVuHeSo) || 0;
    const pcKhuVucHeSo = Number(currentInputs.pcKhuVucHeSo) || 0;
    const pcThamNienPct = Number(currentInputs.pcThamNienPct) || 0;
    const pcVuotKhungPct = Number(currentInputs.pcVuotKhungPct) || 0;
    
    // 1. Lương chính = Lương cơ sở * Hệ số lương
    const luongChinh = Math.round(lcs * hsl);
    
    // 2. Phụ cấp vượt khung = Lương chính * (PC Vượt khung / 100)
    const pcVuotKhung = Math.round(luongChinh * (pcVuotKhungPct / 100));

    // 3. Phụ cấp chức vụ = Lương cơ sở * Hệ số PC Chức vụ
    const pcChucVu = Math.round(lcs * pcChucVuHeSo);

    // 4. Phụ cấp ưu đãi = (Lương chính + Phụ cấp chức vụ + Phụ cấp vượt khung) * (PC Ưu đãi / 100)
    const pcUuDai = Math.round((luongChinh + pcChucVu + pcVuotKhung) * (pcUuDaiPct / 100));

    // 5. Phụ cấp khu vực = Lương cơ sở * Hệ số PC Khu vực
    const pcKhuVuc = Math.round(lcs * pcKhuVucHeSo);

    // 6. Phụ cấp thâm niên = (Lương chính + Phụ cấp chức vụ + Phụ cấp vượt khung) * (PC Thâm niên / 100)
    const pcThamNien = Math.round((luongChinh + pcChucVu + pcVuotKhung) * (pcThamNienPct / 100));

    // 7. TỔNG LƯƠNG GÓP = Lương chính + Phụ cấp ưu đãi + Phụ cấp chức vụ + Phụ cấp khu vực + Phụ cấp thâm niên + Phụ cấp vượt khung
    const tongLuongGop = luongChinh + pcUuDai + pcChucVu + pcKhuVuc + pcThamNien + pcVuotKhung;

    // 8. Bảo hiểm (đóng trên các khoản: Lương chính + PC Chức vụ + PC Thâm niên + PC Vượt khung)
    // Cơ sở tính BH = Lương chính + Phụ cấp chức vụ + Phụ cấp thâm niên + Phụ cấp vượt khung
    const coSoTinhBH = luongChinh + pcChucVu + pcThamNien + pcVuotKhung;

    // Trừ BHYT (1.5%)
    const truBHYT = Math.round(coSoTinhBH * 0.015);

    // Trừ BHXH, BHTN (9%)
    const truBHXHBHTN = Math.round(coSoTinhBH * 0.09);

    // THỰC NHẬN = TỔNG LƯƠNG GÓP - Trừ BHYT - Trừ BHXH, BHTN
    const thucNhan = tongLuongGop - truBHYT - truBHXHBHTN;

    setResult({
      luongChinh,
      pcUuDai,
      pcChucVu,
      pcKhuVuc,
      pcVuotKhung,
      pcThamNien,
      tongLuongGop,
      coSoTinhBH,
      truBHYT,
      truBHXHBHTN,
      thucNhan,
    });
  };

  // Perform initial calculation on mount & auto-updates
  useEffect(() => {
    performCalculation(inputs);
  }, [inputs]);

  // Handle dropdown Đối tượng/Cấp dạy change
  const handleDoiTuongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let pct = 35;
    if (value === "gdtx") {
      pct = 40;
    } else if (value === "mamnon_tieuhoc" || value === "mamnon_phothong") {
      pct = 35;
    } else if (value === "thcs_thpt") {
      pct = 30;
    } else if (value === "mamnon_45" || value === "tieuhoc_45" || value === "mamnon_tieuhoc_45") {
      pct = 45;
    }

    const nextInputs = {
      ...inputs,
      doiTuong: value,
      pcUuDaiPct: pct,
    };
    setInputs(nextInputs);
  };

  // Generic value changes safely
  const handleInputChange = (field: keyof SalaryInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculateClick = () => {
    setIsCalculated(false);
    setTimeout(() => {
      performCalculation(inputs);
      setIsCalculated(true);
      // Scroll to result view if on mobile
      const element = document.getElementById("ket-qua-tinh");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 400);
  };

  // Clear all inputs (Xóa tất cả)
  const handleReset = () => {
    setInputs({
      luongCoSo: 2340000,
      doiTuong: "mamnon_tieuhoc",
      heSoLuong: 0,
      pcUuDaiPct: 35,
      pcChucVuHeSo: 0.0,
      pcKhuVucHeSo: 0.0,
      pcThamNienPct: 0,
      pcVuotKhungPct: 0,
    });
    setIsCustomPcChucVu(false);
  };

  // Format currency formatting
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
  };

  // Generate the Single Standalone HTML source string (incorporating standard styles & scripts)
  const generateStandaloneHTML = (): string => {
    const lcs = inputs.luongCoSo;
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tính Lương Giáo Viên NĐ 182/2026/NĐ-CP</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Product Sans"', 'Arial', 'Helvetica', 'sans-serif'],
            display: ['"Product Sans"', 'Arial', 'Helvetica', 'sans-serif'],
          },
          colors: {
            cream: {
              light: 'transparent',
              dark: '#EFEBD8',
            }
          }
        }
      }
    }
  </script>
  <!-- Google Fonts Product Sans link -->
  <link href="https://fonts.cdnfonts.com/css/product-sans" rel="stylesheet">
  <style>
    body {
      background-color: #E5E7EB;
      font-family: 'Product Sans', 'Arial', 'Helvetica', sans-serif;
    }
  </style>
</head>
<body class="py-10 px-4 min-h-screen flex items-center justify-center">

  <div class="w-full max-w-2xl bg-white border border-[#EFEBD8] rounded-[24px] shadow-xl overflow-hidden p-6 md:p-8">
    
    <!-- HEADER -->
    <div class="text-center mb-8">
      <h1 class="text-xl md:text-2xl font-black text-[#E11D48] font-display tracking-tight leading-tight uppercase">
        TÍNH LƯƠNG THAM KHẢO NĐ 182/2026/NĐ-CP
      </h1>
      <p class="text-[11px] font-black tracking-widest text-[#1D4ED8] uppercase mt-2">
        (PHÁT TRIỂN BỞI THẦY NGUYỄN VĂN THIỆP)
      </p>
      <p class="text-[11px] font-extrabold tracking-wider text-stone-800 uppercase mt-1.5">
        Trường Tiểu học An Thịnh, Trung Kênh, Bắc Ninh
      </p>
      <div class="w-44 h-1 bg-[#E11D48] mx-auto mt-4 rounded-full opacity-85"></div>
    </div>

    <!-- FORM INPUTS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      <!-- Lương cơ sở -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>💵 Lương cơ sở</span>
        </label>
        <select id="luongCoSo" onchange="calculateSalary()" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all">
          <option value="2340000" ${lcs === 2340000 ? 'selected' : ''}>2.340.000 VNĐ (Hiện hành)</option>
          <option value="2530000" ${lcs === 2530000 ? 'selected' : ''}>2.530.000 VNĐ (Dự kiến +8% từ 1/7/2026)</option>
        </select>
      </div>

      <!-- Đối tượng / Cấp dạy -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>🏫 Đối tượng / Cấp dạy</span>
        </label>
        <select id="doiTuong" onchange="handleDoiTuongChange(this.value)" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all">
          <option value="mamnon_tieuhoc" ${inputs.doiTuong === "mamnon_tieuhoc" ? 'selected' : ''}>Giáo viên MN/TH (35%)</option>
          <option value="mamnon_tieuhoc_45" ${inputs.doiTuong === "mamnon_tieuhoc_45" ? 'selected' : ''}>Giáo viên MN/TH (45%)</option>
          <option value="thcs_thpt" ${inputs.doiTuong === "thcs_thpt" ? 'selected' : ''}>GV THCS/THPT (30%)</option>
          <option value="gdtx" ${inputs.doiTuong === "gdtx" ? 'selected' : ''}>Giáo viên THPT (40%)</option>
        </select>
      </div>

      <!-- Hệ số lương -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>📈 Hệ số lương</span>
        </label>
        <input type="number" step="0.01" id="heSoLuong" value="${inputs.heSoLuong}" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all" oninput="calculateSalary()">
      </div>

      <!-- PC Ưu đãi (%) -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>🛡️ PC Ưu đãi (%)</span>
        </label>
        <input type="number" id="pcUuDaiPct" value="${inputs.pcUuDaiPct}" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all" oninput="calculateSalary()">
      </div>

      <!-- PC Chức vụ (Hệ số) -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>🎖️ PC Chức vụ (Hệ số)</span>
        </label>
        <select id="pcChucVuHeSo" onchange="calculateSalary()" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all">
          <option value="0" ${Number(inputs.pcChucVuHeSo) === 0 ? 'selected' : ''}>Không giữ chức vụ (0)</option>
          <option value="0.5" ${Number(inputs.pcChucVuHeSo) === 0.5 ? 'selected' : ''}>Hiệu Trưởng MN (0,5)</option>
          <option value="0.35" ${Number(inputs.pcChucVuHeSo) === 0.35 ? 'selected' : ''}>Phó Hiệu Trưởng MN (0,35)</option>
          <option value="0.4" ${Number(inputs.pcChucVuHeSo) === 0.4 ? 'selected' : ''}>Hiệu Trưởng TH (0,4)</option>
          <option value="0.3" ${Number(inputs.pcChucVuHeSo) === 0.3 ? 'selected' : ''}>Phó Hiệu Trưởng TH (0,3)</option>
          <option value="0.2" ${Number(inputs.pcChucVuHeSo) === 0.2 ? 'selected' : ''}>Tổ trưởng CM (0,2)</option>
          <option value="0.15" ${Number(inputs.pcChucVuHeSo) === 0.15 ? 'selected' : ''}>Tổ phó CM (0,15)</option>
        </select>
      </div>

      <!-- PC Khu vực (Hệ số) -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>📍 PC Khu vực (Hệ số)</span>
        </label>
        <input type="number" step="0.01" id="pcKhuVucHeSo" value="${inputs.pcKhuVucHeSo}" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all" oninput="calculateSalary()">
      </div>

      <!-- PC Thâm niên (%) -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>⏳ PC Thâm niên (%)</span>
        </label>
        <input type="number" id="pcThamNienPct" value="${inputs.pcThamNienPct}" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all" oninput="calculateSalary()">
      </div>

      <!-- PC Vượt khung (%) -->
      <div class="flex flex-col">
        <label class="text-[11px] font-bold text-[#003B73] uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
          <span>🚀 PC Vượt khung (%)</span>
        </label>
        <input type="number" id="pcVuotKhungPct" value="${inputs.pcVuotKhungPct}" class="w-full bg-white border-1.5 border-[#E2E2D1] rounded-[10px] px-3.5 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:bg-white focus:border-[#1D4ED8] transition-all" oninput="calculateSalary()">
      </div>
    </div>

    <!-- MAIN ACTION BUTTON -->
    <div class="mb-8">
      <button onclick="triggerCalculation()" class="w-full bg-[#1D4ED8] hover:bg-[#11379E] text-white font-black uppercase py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all tracking-widest text-base flex items-center justify-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
        TÍNH LƯƠNG
      </button>
    </div>

    <!-- RESULT CARD (Dotted border) -->
    <div id="resultCard" class="border-4 border-dashed border-[#1D4ED8] rounded-2xl p-5 md:p-6 bg-transparent transition-colors duration-200">
      <h3 class="text-sm font-black text-[#1D4ED8] uppercase tracking-widest border-b-2 border-gray-300 pb-3 mb-4 flex items-center gap-2">
        <span>📊 CHI TIẾT BẢNG LƯƠNG NHẬN ĐƯỢC</span>
      </h3>

      <div class="space-y-3.5 text-[13px]" id="calcResults">
        <div class="flex justify-between items-center py-2 border-b border-gray-300">
          <span class="text-stone-700 font-medium">Lương chính:</span>
          <span class="font-black text-[#111111]" id="resLuongChinh">0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-300">
          <span class="text-black font-normal flex items-center gap-1">
            Phụ cấp ưu đãi: <span id="resPcUuDaiPctLabel" class="text-[11px] font-normal text-black">(0%)</span>
          </span>
          <span class="font-black text-black" id="resPcUuDai">0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-300">
          <span class="text-stone-700 font-medium">Phụ cấp chức vụ:</span>
          <span class="font-black text-[#111111]" id="resPcChucVu">0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-300">
          <span class="text-stone-700 font-medium">Phụ cấp khu vực:</span>
          <span class="font-black text-[#111111]" id="resPcKhuVuc">0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-300">
          <span class="text-black font-normal flex items-center gap-1">
            Phụ cấp thâm niên nhà giáo: <span id="resPcThamNienPctLabel" class="text-[11px] font-normal text-black">(0%)</span>
          </span>
          <span class="font-black text-black" id="resPcThamNien">0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 pb-3.5 border-b border-gray-300">
          <span class="text-stone-700 font-medium">Phụ cấp vượt khung:</span>
          <span class="font-black text-[#111111]" id="resPcVuotKhung">0 đ</span>
        </div>

        <div class="flex justify-between items-center py-2">
          <span class="text-stone-800 font-black text-sm">TỔNG LƯƠNG GỘP:</span>
          <span class="font-black text-stone-900 text-base" id="resTongLuong">0 đ</span>
        </div>

        <div class="flex justify-between items-center py-2 text-[#E11D48] border-b border-gray-300">
          <span class="font-bold">Trừ BHYT (1.5%):</span>
          <span class="font-black whitespace-nowrap" id="resTruBHYT">-0 đ</span>
        </div>
        <div class="flex justify-between items-center py-2 text-[#E11D48] border-b border-gray-300">
          <span class="font-bold">Trừ BHXH, BHTN (9%):</span>
          <span class="font-black whitespace-nowrap" id="resTruBH"> -0 đ</span>
        </div>

        <div class="flex flex-col items-center justify-center pt-5 pb-2 text-center border-t-2 border-gray-300">
          <span class="text-base font-black text-stone-600 uppercase tracking-widest mb-1.5">THỰC NHẬN CUỐI CÙNG</span>
          <span class="text-3xl md:text-4xl font-black text-[#E11D48] font-display transition-all scale-100" id="resThucNhan">0 đ</span>
        </div>
      </div>
    </div>

    <!-- SMALL LEGAL METRICS FOOTER -->
    <p class="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
      Nội dung tính toán dựa trên hướng dẫn cơ cấu tổ chức bậc lương nhà nước.<br/>
      Ứng dụng phân phối tự do. Chúc các thầy cô công tác tốt!
    </p>

  </div>

  <script>
    function formatVND(value) {
      return new Intl.NumberFormat("vi-VN").format(value) + " đ";
    }

    function handleDoiTuongChange(val) {
      const uUdaiInput = document.getElementById('pcUuDaiPct');
      if (val === 'gdtx') {
        uUdaiInput.value = 40;
      } else if (val === 'mamnon_tieuhoc' || val === 'mamnon_phothong') {
        uUdaiInput.value = 35;
      } else if (val === 'thcs_thpt') {
        uUdaiInput.value = 30;
      } else if (val === 'mamnon_45' || val === 'tieuhoc_45' || val === 'mamnon_tieuhoc_45') {
        uUdaiInput.value = 45;
      }
      calculateSalary();
    }

    function calculateSalary() {
      // Inputs
      const lcs = Number(document.getElementById('luongCoSo').value) || 2340000;

      const heSoLuong = Number(document.getElementById('heSoLuong').value) || 0;
      const pcUuDaiPct = Number(document.getElementById('pcUuDaiPct').value) || 0;
      const pcChucVuHeSo = Number(document.getElementById('pcChucVuHeSo').value) || 0;
      const pcKhuVucHeSo = Number(document.getElementById('pcKhuVucHeSo').value) || 0;
      const pcThamNienPct = Number(document.getElementById('pcThamNienPct').value) || 0;
      const pcVuotKhungPct = Number(document.getElementById('pcVuotKhungPct').value) || 0;

      // Formulas
      const luongChinh = Math.round(lcs * heSoLuong);
      const pcVuotKhung = Math.round(luongChinh * (pcVuotKhungPct / 100));
      const pcChucVu = Math.round(lcs * pcChucVuHeSo);
      const pcUuDai = Math.round((luongChinh + pcChucVu + pcVuotKhung) * (pcUuDaiPct / 100));
      const pcKhuVuc = Math.round(lcs * pcKhuVucHeSo);
      const pcThamNien = Math.round((luongChinh + pcChucVu + pcVuotKhung) * (pcThamNienPct / 100));

      const tongLuongGop = luongChinh + pcUuDai + pcChucVu + pcKhuVuc + pcThamNien + pcVuotKhung;

      // BH base
      const coSoTinhBH = luongChinh + pcChucVu + pcThamNien + pcVuotKhung;
      const truBHYT = Math.round(coSoTinhBH * 0.015);
      const truBHXHBHTN = Math.round(coSoTinhBH * 0.09);

      const thucNhan = tongLuongGop - truBHYT - truBHXHBHTN;

      // Bind outputs
      document.getElementById('resLuongChinh').innerText = formatVND(luongChinh);
      document.getElementById('resPcUuDai').innerText = formatVND(pcUuDai);
      document.getElementById('resPcUuDaiPctLabel').innerText = "(" + pcUuDaiPct + "%)";
      document.getElementById('resPcChucVu').innerText = formatVND(pcChucVu);
      document.getElementById('resPcKhuVuc').innerText = formatVND(pcKhuVuc);
      document.getElementById('resPcThamNien').innerText = formatVND(pcThamNien);
      document.getElementById('resPcThamNienPctLabel').innerText = "(" + pcThamNienPct + "%)";
      document.getElementById('resPcVuotKhung').innerText = formatVND(pcVuotKhung);
      document.getElementById('resTongLuong').innerText = formatVND(tongLuongGop);
      document.getElementById('resTruBHYT').innerText = "-" + formatVND(truBHYT);
      document.getElementById('resTruBH').innerText = "-" + formatVND(truBHXHBHTN);
      document.getElementById('resThucNhan').innerText = formatVND(thucNhan);
    }

    function triggerCalculation() {
      // Visual feedback
      const card = document.getElementById('resultCard');
      card.classList.add('opacity-90');
      calculateSalary();
      setTimeout(() => {
        card.classList.remove('opacity-90');
      }, 400);
    }

    // Run initially
    calculateSalary();
  </script>
</body>
</html>`;
  };

  // Process copy HTML operation
  const handleCopyHTML = () => {
    const code = generateStandaloneHTML();
    navigator.clipboard.writeText(code).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    });
  };

  // Clean trigger standalone HTML file downloads
  const handleDownloadHTML = () => {
    const htmlString = generateStandaloneHTML();
    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "TinhLuongGiaoVien_ND182.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 3000);
  };

  return (
    <div className={`min-h-screen py-2 px-1.5 sm:py-8 sm:px-6 lg:px-8 transition-colors duration-300 ${
      themeMode === 'cream' ? 'bg-[#E5E7EB]' : 'bg-zinc-900 text-zinc-100'
    } flex flex-col justify-between`}>
      
      {/* Toast Alert Notifications */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Check className="h-4 w-4 stroke-[3px]" />
            <span>Đã sao chép toàn bộ mã HTML Standalone vào bộ nhớ tạm!</span>
          </motion.div>
        )}

        {showDownloadToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-blue-800 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <FileDown className="h-4 w-4 animate-bounce" />
            <span>Đang tải xuống file TinhLuongGiaoVien_ND182.html thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-3 sm:gap-6 my-auto">
        
        {/* Main Calculator Card */}
        <div className="w-full flex justify-center">
          <div className={`w-full max-w-2xl border transition-all duration-300 shadow-xl rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 md:p-8 flex flex-col justify-between ${
            themeMode === "cream" 
              ? "bg-white border-[#EFEBD8]" 
              : "bg-zinc-800 border-zinc-700"
          }`} id="main-salary-card">
            
            {/* Header branding */}
            <div className="text-center mb-3 sm:mb-6">
              <h1 className="text-base sm:text-xl md:text-2xl font-black text-[#E11D48] tracking-tight leading-none uppercase font-display select-none">
                TÍNH LƯƠNG THAM KHẢO NĐ 182/2026/NĐ-CP
              </h1>
              <p className="text-[10px] sm:text-xs font-black text-[#1D4ED8] dark:text-blue-400 tracking-wide mt-1.5">
                (PHÁT TRIỂN BỞI THẦY NGUYỄN VĂN THIỆP)
              </p>
              <p className={`text-[9px] sm:text-[11px] md:text-xs font-extrabold tracking-wide mt-1 uppercase ${
                themeMode === "cream" ? "text-stone-900" : "text-zinc-100"
              }`}>
                Trường Tiểu học An Thịnh, Trung Kênh, Bắc Ninh
              </p>
              <div className="w-24 sm:w-44 h-0.5 sm:h-1 bg-[#E11D48] mx-auto mt-2 sm:mt-4 rounded-full opacity-85"></div>
            </div>

            {/* Inputs grid - 2 Columns */}
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-2.5 sm:gap-x-5 sm:gap-y-3.5 mb-4 sm:mb-6">
              
              {/* Box 1: Base Salary Dropdown */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600" />
                  <span>Lương cơ sở</span>
                </label>
                
                <select 
                  id="sel-luong-co-so"
                  value={inputs.luongCoSo}
                  onChange={(e) => handleInputChange("luongCoSo", Number(e.target.value))}
                  className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                    themeMode === 'cream' 
                      ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                      : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                  }`}
                >
                  <option value={2340000}>2.340.000 VNĐ (Hiện tại)</option>
                  <option value={2530000}>2.530.000 VNĐ (Dự kiến +8% từ 1/7/2026)</option>
                </select>
              </div>

              {/* Box 2: Object type Dropdown */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                  <span>Đối tượng / Cấp dạy</span>
                </label>
                <select 
                  id="sel-doi-tuong"
                  value={inputs.doiTuong}
                  onChange={handleDoiTuongChange}
                  className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                    themeMode === 'cream' 
                      ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                      : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                  }`}
                >
                  <option value="mamnon_tieuhoc">Giáo viên MN/TH (35%)</option>
                  <option value="mamnon_tieuhoc_45">Giáo viên MN/TH (45%)</option>
                  <option value="thcs_thpt">GV THCS/THPT (30%)</option>
                  <option value="gdtx">Giáo viên THPT (40%)</option>
                </select>
              </div>

              {/* Box 3: Salary Coefficient */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
                  <span>Hệ số lương</span>
                </label>
                <div className="relative">
                  <input 
                    id="input-he-so-luong"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs.heSoLuong}
                    onChange={(e) => handleInputChange("heSoLuong", e.target.value)}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Box 4: Incentives Pct */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <Percent className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-600" />
                  <span>PC Ưu đãi (%)</span>
                </label>
                <div className="relative">
                  <input 
                    id="input-pc-uu-dai"
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.pcUuDaiPct}
                    onChange={(e) => handleInputChange("pcUuDaiPct", e.target.value)}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
               {/* Box 5: Position Allowance Coefficient */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-600" />
                  <span>PC Chức vụ (Hệ số)</span>
                </label>
                <div className="space-y-1.5">
                  <select 
                    id="sel-pc-chuc-vu"
                    value={Number(inputs.pcChucVuHeSo)}
                    onChange={(e) => {
                      handleInputChange("pcChucVuHeSo", Number(e.target.value));
                    }}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  >
                    <option value={0}>Không giữ chức vụ (0)</option>
                    <option value={0.5}>Hiệu Trưởng MN (0,5)</option>
                    <option value={0.35}>Phó Hiệu Trưởng MN (0,35)</option>
                    <option value={0.4}>Hiệu Trưởng TH (0,4)</option>
                    <option value={0.3}>Phó Hiệu Trưởng TH (0,3)</option>
                    <option value={0.2}>Tổ trưởng CM (0,2)</option>
                    <option value={0.15}>Tổ phó CM (0,15)</option>
                  </select>
                </div>
              </div>

              {/* Box 6: Regional Allowance Coefficient */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
                  <span>PC Khu vực (Hệ số)</span>
                </label>
                <div className="relative">
                  <input 
                    id="input-pc-khu-vuc"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs.pcKhuVucHeSo}
                    onChange={(e) => handleInputChange("pcKhuVucHeSo", e.target.value)}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Box 7: Seniority Allowance */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-600" />
                  <span>PC Thâm niên (%)</span>
                </label>
                <div className="relative">
                  <input 
                    id="input-pc-tham-nien"
                    type="number"
                    min="0"
                    value={inputs.pcThamNienPct}
                    onChange={(e) => handleInputChange("pcThamNienPct", e.target.value)}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Box 8: Over-range limit Pct */}
              <div className="flex flex-col">
                <label className={`text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-1.5 ${
                  themeMode === 'cream' ? 'text-[#003B73]' : 'text-zinc-300'
                }`}>
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-600" />
                  <span>PC Vượt khung (%)</span>
                </label>
                <div className="relative">
                  <input 
                    id="input-pc-vuot-khung"
                    type="number"
                    min="0"
                    value={inputs.pcVuotKhungPct}
                    onChange={(e) => handleInputChange("pcVuotKhungPct", e.target.value)}
                    className={`w-full text-xs sm:text-sm font-medium border rounded-[10px] px-2 py-1.5 xs:px-2.5 xs:py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-colors duration-200 outline-none focus:ring-0 ${
                      themeMode === 'cream' 
                        ? "bg-white border-[#E2E2D1] text-gray-800 hover:bg-white focus:bg-white focus:border-[#1D4ED8]" 
                        : "bg-zinc-700 border-zinc-600 text-zinc-100 focus:bg-zinc-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

            </div>

             {/* Action panel with dual buttons */}
            <div className="flex flex-row gap-2 mt-2">
              <button
                id="btn-tinh-luong"
                type="button"
                onClick={handleCalculateClick}
                className="flex-1 bg-[#1D4ED8] hover:bg-[#1743bd] active:bg-[#11328f] text-white font-extrabold uppercase py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-[12px] shadow-sm hover:shadow transition-all transform active:scale-[0.98] tracking-wider text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>TÍNH LƯƠNG</span>
              </button>

              <button
                id="btn-reset-form"
                type="button"
                onClick={handleReset}
                className={`px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-[12px] border font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  themeMode === "cream"
                    ? "bg-white hover:bg-gray-50 border-[#E2E2D1] text-[#003B73]"
                    : "bg-zinc-750 hover:bg-zinc-700 border-zinc-650 text-zinc-300"
                }`}
                title="Xóa tất cả dữ liệu đã nhập"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sm:inline hidden">Xóa tất cả</span>
              </button>
            </div>

            {/* RESULTS VIEW (Highlighted & Centered) */}
            <div 
              id="ket-qua-tinh" 
              className={`mt-4 sm:mt-8 border-2 sm:border-4 border-dashed rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 md:p-8 transition-all duration-300 shadow-xl ${
                themeMode === 'cream'
                  ? 'border-[#1D4ED8] bg-transparent shadow-gray-100/60 ring-2 sm:ring-4 ring-[#1D4ED8]/5'
                  : 'border-zinc-650 bg-[#1e293b]/90 shadow-[#0f172a]/50 ring-2 sm:ring-4 ring-zinc-700/25'
              }`}
            >
              <div className={`flex flex-col items-center justify-center border-b pb-2 sm:pb-4 mb-2.5 sm:mb-5 text-center ${
                themeMode === 'cream' ? 'border-gray-300' : 'border-[#1D4ED8]/30'
              }`}>
                <h3 className={`text-xs sm:text-base md:text-lg font-black tracking-wider flex items-center justify-center uppercase ${
                  themeMode === 'cream' ? 'text-[#1D4ED8]' : 'text-blue-450'
                }`}>
                  <span>BẢNG KẾT QUẢ THAM KHẢO</span>
                </h3>
              </div>

              {/* Dynamic state check with smooth feedback */}
              <AnimatePresence mode="wait">
                {isCalculated ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1 sm:space-y-3 font-medium text-xs sm:text-[13px]"
                  >
                    {/* Items lines */}
                    <div className={`flex justify-between items-center py-1 sm:py-2 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-200/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`${themeMode === 'cream' ? 'text-stone-800' : 'text-stone-300'} font-semibold`}>Lương chính:</span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-luong-chinh">{formatVND(result.luongChinh)}</span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-200/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`font-normal flex items-center gap-1 ${themeMode === 'cream' ? 'text-black' : 'text-stone-200'}`}>
                        Phụ cấp ưu đãi: 
                        <span className={`text-[10px] sm:text-[11px] font-normal ${themeMode === 'cream' ? 'text-gray-500' : 'text-stone-400'}`}>({inputs.pcUuDaiPct}%)</span>
                      </span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-pc-uu-dai">{formatVND(result.pcUuDai)}</span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-200/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`${themeMode === 'cream' ? 'text-stone-800' : 'text-stone-300'} font-medium flex items-center gap-1`}>
                        Phụ cấp chức vụ: 
                        {inputs.pcChucVuHeSo > 0 && <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500">(Hệ số {inputs.pcChucVuHeSo})</span>}
                      </span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-pc-chuc-vu">{formatVND(result.pcChucVu)}</span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-200/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`${themeMode === 'cream' ? 'text-stone-800' : 'text-stone-300'} font-medium flex items-center gap-1`}>
                        Phụ cấp khu vực:
                        {inputs.pcKhuVucHeSo > 0 && <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500">(Hệ số {inputs.pcKhuVucHeSo})</span>}
                      </span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-pc-khu-vuc">{formatVND(result.pcKhuVuc)}</span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-200/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`${themeMode === 'cream' ? 'text-stone-800' : 'text-stone-300'} font-medium flex items-center gap-1`}>
                        Phụ cấp vượt khung:
                        {inputs.pcVuotKhungPct > 0 && <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500">({inputs.pcVuotKhungPct}%)</span>}
                      </span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-pc-vuot-khung">{formatVND(result.pcVuotKhung)}</span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 pb-1.5 sm:pb-3 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-250/30 dark:border-zinc-700/50'
                    }`}>
                      <span className={`font-normal flex items-center gap-1 ${themeMode === 'cream' ? 'text-black' : 'text-stone-200'}`}>
                        Phụ cấp thâm niên nhà giáo:
                        {inputs.pcThamNienPct > 0 && <span className={`text-[10px] sm:text-[11px] font-normal ${themeMode === 'cream' ? 'text-gray-500' : 'text-stone-400'}`}>({inputs.pcThamNienPct}%)</span>}
                      </span>
                      <span className={`font-extrabold ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-pc-tham-nien">{formatVND(result.pcThamNien)}</span>
                    </div>

                    {/* Gross */}
                    <div className="flex justify-between items-center py-1 sm:py-2 text-stone-850">
                      <span className={`font-extrabold text-xs sm:text-sm ${themeMode === 'cream' ? 'text-stone-900' : 'text-zinc-200'}`}>TỔNG LƯƠNG GỘP:</span>
                      <span className={`font-black ${themeMode === 'cream' ? 'text-black' : 'text-zinc-100'}`} id="display-tong-luong-gop">{formatVND(result.tongLuongGop)}</span>
                    </div>

                    {/* Insurance details */}
                    <div className={`flex justify-between items-center py-1 sm:py-2 text-[#E11D48] border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-250/30 dark:border-zinc-700/50'
                    }`}>
                      <span className="font-semibold flex items-center gap-1">
                        Trừ Bảo hiểm Y tế (1.5%):
                      </span>
                      <span className="font-bold text-xs sm:text-sm whitespace-nowrap" id="display-tru-bhyt">
                        - {formatVND(result.truBHYT)}
                      </span>
                    </div>

                    <div className={`flex justify-between items-center py-1 sm:py-2 text-[#E11D48] pb-1.5 sm:pb-3.5 border-b ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-250/30 dark:border-zinc-700/50'
                    }`}>
                      <span className="font-semibold flex items-center gap-1">
                        Trừ BHXH & BHTN (9%):
                      </span>
                      <span className="font-bold text-xs sm:text-sm whitespace-nowrap" id="display-tru-bhxh">
                        - {formatVND(result.truBHXHBHTN)}
                      </span>
                    </div>

                    {/* Final Net Take-home */}
                    <div className={`flex flex-col items-center justify-center pt-3.5 sm:pt-5 pb-1 text-center border-t-2 ${
                      themeMode === 'cream' ? 'border-gray-300' : 'border-blue-250/40 dark:border-zinc-700/50'
                    }`}>
                      <span className={`text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-widest mb-1 sm:mb-1.5 flex items-center gap-1 ${
                        themeMode === 'cream' ? 'text-[#1D4ED8]' : 'text-zinc-400'
                      }`}>
                        ⭐ THỰC NHẬN ⭐
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#E11D48] drop-shadow-sm font-display tracking-tight" id="display-thuc-nhan">
                        {formatVND(result.thucNhan)}
                      </span>
                    </div>

                  </motion.div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đang cập nhật công thức...</span>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
