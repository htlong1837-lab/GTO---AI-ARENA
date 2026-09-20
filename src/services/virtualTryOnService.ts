import { TryOnModel, ClothingItemOption, TryOnResultRecord, BASE_STUDIO_MODELS } from '../data/modelsTryOn';
import { GeminiService } from './geminiService';
import { GARMENTS } from '../data/garments';
import { COLORS } from '../data/colors';
import { OCCASIONS } from '../data/occasions';
import { STYLES } from '../data/styles';

const STORAGE_KEY_HISTORY = 'gto_fitroom_history_v2';

export interface GenerateTryOnParams {
  model: TryOnModel;
  customModelImage?: string | null;
  clothes: ClothingItemOption;
  customClothesImage?: string | null;
  selectedColorHex?: string;
  selectedColorName?: string;
  accessoryNames?: string[];
  isHighQuality?: boolean;
  onProgress?: (progress: number, stepText: string) => void;
}

export class VirtualTryOnService {
  /**
   * Generates a virtual try-on fitting room image with step-by-step progress
   */
  static async generateTryOn(params: GenerateTryOnParams): Promise<TryOnResultRecord> {
    const {
      model,
      customModelImage,
      clothes,
      customClothesImage,
      selectedColorName,
      accessoryNames = [],
      isHighQuality = false,
      onProgress
    } = params;

    const updateProgress = (p: number, text: string) => {
      if (onProgress) onProgress(p, text);
    };

    updateProgress(15, `Đang đối chiếu diện mạo & vóc dáng ${model.name}...`);
    await new Promise((r) => setTimeout(r, 450));

    updateProgress(35, `Đang phân tách nếp gấp lụa ${clothes.name}...`);
    await new Promise((r) => setTimeout(r, 550));

    let resultImageUrl = '';

    // Check if Gemini AI is configured and ready
    const aiStatus = await GeminiService.checkStatus();
    if (aiStatus.configured && !customClothesImage) {
      updateProgress(60, `Đang gọi AI Virtual Try-On để mặc ${clothes.name} lên người mẫu ${model.name}...`);
      const matchedGarment = GARMENTS.find((g) => g.id === clothes.garmentType) || GARMENTS[0];
      const matchedColor = COLORS.find((c) => c.vietnameseName === selectedColorName) || COLORS[0];
      
      const prompt = GeminiService.buildHeritageFashionPrompt({
        garment: matchedGarment,
        color: matchedColor,
        occasion: OCCASIONS[0],
        style: STYLES[1],
        accessoryNames,
        gender: model.gender
      });

      // Ensure we have the base model photo as Base64 to perform authentic Virtual Try-On
      let baseImageToSend = customModelImage || undefined;
      if (!baseImageToSend && model.basePhotoUrl) {
        try {
          const res = await fetch(model.basePhotoUrl);
          if (res.ok) {
            const blob = await res.blob();
            baseImageToSend = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => resolve(undefined as any);
              reader.readAsDataURL(blob);
            });
          }
        } catch (e) {
          console.warn('Could not load base model photo for VTON:', e);
        }
      }

      const aiRes = await GeminiService.generateOutfitImage(prompt, {
        baseImageBase64: baseImageToSend
      });
      if (aiRes.success && aiRes.imageUrl) {
        resultImageUrl = aiRes.imageUrl;
      }
    }

    if (!resultImageUrl) {
      updateProgress(75, isHighQuality ? 'Đang kích hoạt hiệu ứng ánh sáng Studio PBR sắc nét...' : 'Đang khớp trang phục lên vóc dáng người mẫu...');
      await new Promise((r) => setTimeout(r, 500));

      if (customClothesImage) {
        resultImageUrl = customClothesImage;
      } else if (customModelImage) {
        resultImageUrl = customModelImage;
      } else {
        resultImageUrl = clothes.defaultModelLookUrl[model.id] || clothes.thumbnailUrl;
      }
    }

    updateProgress(90, 'Đang hoàn tất ánh sáng và bóng đổ di sản...');
    await new Promise((r) => setTimeout(r, 350));

    const newRecord: TryOnResultRecord = {
      id: `fit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      imageUrl: resultImageUrl,
      baseModelImageUrl: customModelImage || model.basePhotoUrl,
      modelName: customModelImage ? 'Người mẫu của bạn' : model.name,
      modelGender: model.gender,
      clothesName: `${clothes.name}${selectedColorName ? ` (${selectedColorName})` : ''}`,
      harmonyScore: Math.floor(Math.random() * 6) + 94, // 94% - 99%
      heritageRating: 'Chuẩn mực Di sản',
      accessoryNames
    };

    // Save to local storage
    this.saveToHistory(newRecord);
    updateProgress(100, 'Hoàn tất bản phối!');

    return newRecord;
  }

  /**
   * Get historical fitting room looks
   */
  static getHistory(): TryOnResultRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) {
        return [
          {
            id: 'starter-female-aodai',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            imageUrl: '/images/looks/look_aodai_duxuan.jpg',
            baseModelImageUrl: '/images/hero_model_alpha.png',
            modelName: 'Mẫu Nữ ♀ (Mai Anh)',
            modelGender: 'female',
            clothesName: 'Áo Dài Truyền Thống Tân Thời (Đỏ Son)',
            harmonyScore: 98,
            heritageRating: 'Chuẩn mực Di sản',
            accessoryNames: ['Kiềng Bạc', 'Sneaker Chunky']
          },
          {
            id: 'starter-male-nguthan',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            imageUrl: '/images/looks/look_nguthan_trachieu.jpg',
            baseModelImageUrl: '/images/hero_vietphuc.jpg',
            modelName: 'Mẫu Nam ♂ (Hoàng Long)',
            modelGender: 'male',
            clothesName: 'Áo Ngũ Thân Lập Lĩnh (Vàng Hoàng Cúc)',
            harmonyScore: 96,
            heritageRating: 'Chuẩn mực Di sản',
            accessoryNames: ['Kiềng Bạc', 'Quạt Xếp Lụa']
          }
        ];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Save a look to history
   */
  static saveToHistory(record: TryOnResultRecord): void {
    try {
      const current = this.getHistory();
      const updated = [record, ...current.filter((r) => r.id !== record.id)].slice(0, 15);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Cannot save try-on history:', e);
    }
  }

  /**
   * Delete look from history
   */
  static deleteFromHistory(recordId: string): TryOnResultRecord[] {
    try {
      const current = this.getHistory();
      const updated = current.filter((r) => r.id !== recordId);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }
}
