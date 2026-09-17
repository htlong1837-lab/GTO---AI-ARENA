import { WeatherCondition } from '../types/outfit';

export const WEATHER_CONDITIONS: WeatherCondition[] = [
  {
    id: 'xuan-se-lanh',
    name: 'Xuân Se Lạnh',
    temperature: '17°C - 21°C',
    season: 'Đầu xuân / Tết',
    region: 'Miền Bắc',
    icon: 'CloudSun',
    vibe: 'Không khí du xuân thoáng mát, phảng phất mưa xuân nhẹ nhàng',
    fabricAdvice: 'Gấm dệt dày dặn, lụa hai lớp, nhung the hoặc layer kèm áo khoác',
    recommendedGarments: ['ao-ngu-than', 'ao-dai', 'nhat-binh'],
    recommendedAccessories: ['boots-da', 'khan-dong', 'blazer-oversize', 'kieng-bac']
  },
  {
    id: 'nang-am-phuong-nam',
    name: 'Nắng Ấm Phương Nam',
    temperature: '30°C - 34°C',
    season: 'Nắng rạng rỡ',
    region: 'Miền Nam',
    icon: 'Sun',
    vibe: 'Nắng vàng rực rỡ, gió sông râm mát, thích hợp di chuyển ngoài trời',
    fabricAdvice: 'Lụa tơ tằm mềm mát, lanh thô dệt tự nhiên, voan nhẹ thoáng khí',
    recommendedGarments: ['ao-ba-ba', 'ao-dai'],
    recommendedAccessories: ['quat-lua-xep', 'tui-coi-theu', 'sneaker-chunky', 'guoc-moc']
  },
  {
    id: 'mua-phun-co-do',
    name: 'Mưa Phùn Cố Đô',
    temperature: '21°C - 24°C',
    season: 'Mùa rêu phong',
    region: 'Miền Trung',
    icon: 'CloudRain',
    vibe: 'Mưa bụi lãng đãng bên sông Hương, đậm chất thơ và hoài niệm cổ kính',
    fabricAdvice: 'Tơ lụa nhuộm màu chàm hoặc tím hoa cà, chất liệu cản gió nhẹ',
    recommendedGarments: ['nhat-binh', 'ao-tu-than', 'ao-ngu-than'],
    recommendedAccessories: ['kieng-bac', 'tram-cai-toc', 'guoc-moc', 'tui-coi-theu']
  },
  {
    id: 'thu-diu-mat',
    name: 'Thu Hà Nội Dịu Mát',
    temperature: '23°C - 26°C',
    season: 'Tiết trời vàng',
    region: 'Toàn quốc',
    icon: 'Wind',
    vibe: 'Tiết trời lý tưởng nhất trong năm để dạo phố, chụp ảnh và dạo cafe',
    fabricAdvice: 'Lụa tơ tằm, linen, taffeta mềm mại phối tự do cùng phụ kiện Gen Z',
    recommendedGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than'],
    recommendedAccessories: ['sneaker-chunky', 'tote-typography', 'kinh-mat-y2k', 'boots-da']
  }
];

