import { Garment, ColorOption, Occasion, StyleGenZ, WeatherCondition } from '../types/outfit';

export interface PromptBuildParams {
  garment: Garment;
  color: ColorOption;
  occasion: Occasion;
  style: StyleGenZ;
  accessoryNames: string[];
  gender: 'female' | 'male';
  weather?: WeatherCondition;
}

export interface AiStatusResponse {
  configured: boolean;
  model: string;
  preview?: string | null;
}

export interface GenerateImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  promptUsed?: string;
}

const LOCAL_KEY_STORAGE = 'vietphuc_remix_custom_gemini_key';

export const GeminiService = {
  // Get locally stored client key if any
  getClientApiKey(): string {
    return localStorage.getItem(LOCAL_KEY_STORAGE) || '';
  },

  setClientApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(LOCAL_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(LOCAL_KEY_STORAGE);
    }
  },

  // Check if server or client has Gemini API Key ready
  async checkStatus(): Promise<AiStatusResponse> {
    try {
      const res = await fetch('/api/ai-status');
      if (res.ok) {
        const data = await res.json();
        const clientKey = this.getClientApiKey();
        if (clientKey) {
          return {
            configured: true,
            model: 'imagen-3.0-generate-002',
            preview: `${clientKey.slice(0, 6)}...${clientKey.slice(-4)}`
          };
        }
        return data;
      }
    } catch (e) {
      console.warn('Cannot reach /api/ai-status, checking client key:', e);
    }
    const clientKey = this.getClientApiKey();
    return {
      configured: Boolean(clientKey && clientKey.length > 5),
      model: 'imagen-3.0-generate-002',
      preview: clientKey ? `${clientKey.slice(0, 6)}...${clientKey.slice(-4)}` : null
    };
  },

  // Save server key to .env via server middleware
  async saveServerKey(apiKey: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/save-ai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  },

  // Build authentic Vietnamese heritage & Gen Z high-fashion prompt
  buildHeritageFashionPrompt(params: PromptBuildParams): string {
    const { garment, color, occasion, style, accessoryNames, gender, weather } = params;
    const isMale = gender === 'male';

    // Model description
    const modelDesc = isMale
      ? 'A charismatic Vietnamese young male fashion model with modern stylish haircut, natural charismatic Asian features, confident elegant posture'
      : 'A stunning Vietnamese young female fashion model with elegant features, sophisticated contemporary makeup, graceful regal posture';

    // Garment specifics
    let garmentDetails = '';
    if (garment.id === 'ao-dai') {
      garmentDetails = 'authentic traditional Vietnamese Ao Dai made of premium flowing silk fabric with two long fluttering split panels extending gracefully over loose wide-leg silk trousers, featuring an iconic mandarin collar with diagonal buttoning';
    } else if (garment.id === 'ao-ngu-than') {
      garmentDetails = 'historical Vietnamese Ao Ngu Than (five-panel aristocratic tunic from the Nguyen Dynasty) tailored from rich brocade with tight-fitting sleeves (Tay Chen), pristine five-panel construction, upright standing collar with refined brass buttons';
    } else if (garment.id === 'ao-nhat-binh') {
      garmentDetails = 'luxurious Vietnamese Ao Nhat Binh (Nguyen Dynasty royal court gown) with iconic large rectangular embroidered collar displaying auspicious multi-color rainbow banded stripes (Ngu Sac) and intricate golden phoenix embroidery motifs';
    } else if (garment.id === 'ao-tu-than') {
      garmentDetails = 'traditional northern Vietnamese Ao Tu Than (four-panel tunic from Kinh Bac) featuring flowing draped panels layered over a delicate silk halter bodice (Ao Yem) and tied waist sash in romantic folk silhouette';
    } else if (garment.id === 'ao-ba-ba') {
      garmentDetails = 'elevated Vietnamese Southern Ao Ba Ba tunic crafted from smooth rustic raw linen and silk, fitted raglan sleeves, traditional front button line, paired with fluid matching trousers';
    } else {
      garmentDetails = `traditional Vietnamese heritage garment: ${garment.name}, ${garment.description}`;
    }

    // Color & Five Elements (Ngũ Hành)
    const colorDesc = `Dominant color palette: ${color.vietnameseName} (${color.name}, hex ${color.hex}), symbol of ${color.element} element with complementary tone ${color.secondaryHex} and subtle accents of ${color.accentHex}`;

    // Styling & Aesthetic Vibe
    const styleDesc = `Fashion aesthetic: ${style.name} (${style.vibe}), seamless Gen Z remix fusing historical Vietnamese ancestral silhouettes with avant-garde modern haute couture, ${style.keyAesthetic}`;

    // Accessories
    const accessoriesDesc = accessoryNames.length > 0
      ? `Styled with curated accessories: ${accessoryNames.join(', ')}`
      : 'Minimalist styling emphasizing pristine fabric texture and silhouette';

    // Setting & Atmosphere based on Occasion & Weather
    let settingDesc = `Atmospheric setting: Editorial background evoking ${occasion.name} (${occasion.description})`;
    if (occasion.id === 'tet') {
      settingDesc = 'Atmospheric setting: Vietnamese Lunar New Year spring ambiance, subtle cherry blossom petals, historic ancient courtyard with vintage tiled roofs';
    } else if (occasion.id === 'da-tiec' || occasion.id === 'fashion-show') {
      settingDesc = 'Atmospheric setting: High-fashion runway studio stage, sleek reflective floor, dramatic museum lighting, contemporary Vietnamese architectural elements';
    } else if (occasion.id === 'dao-pho') {
      settingDesc = 'Atmospheric setting: Sunlit Hanoi Old Quarter or Saigon heritage street corner with French colonial arches and golden natural afternoon light';
    }

    const weatherNote = weather ? `, during ${weather.name} (${weather.season}, ${weather.temperature}) with soft natural ambient light` : '';

    return [
      `Full-body editorial high-fashion photograph for Harper's Bazaar Vietnam.`,
      modelDesc,
      `wearing an ${garmentDetails}.`,
      colorDesc + '.',
      styleDesc + '.',
      accessoriesDesc + '.',
      settingDesc + weatherNote + '.',
      `Shot on Hasselblad H6D-100c, 85mm f/1.8 portrait lens, crisp fabric embroidery details, 8k resolution, photorealistic, cinematic color grading, authentic Vietnamese cultural respect, masterwork quality.`
    ].join(' ');
  },

  // Request AI image generation
  async generateOutfitImage(
    prompt: string,
    options?: { customKey?: string; aspectRatio?: string }
  ): Promise<GenerateImageResult> {
    const customKey = options?.customKey || this.getClientApiKey();
    const aspectRatio = options?.aspectRatio || '3:4';

    try {
      const response = await fetch('/api/generate-ai-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          apiKey: customKey || undefined,
          aspectRatio
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || `Lỗi máy chủ (${response.status})`,
          promptUsed: prompt
        };
      }

      return {
        success: true,
        imageUrl: data.imageUrl,
        promptUsed: data.promptUsed || prompt
      };
    } catch (err: any) {
      // Fallback: If Vite middleware is not reachable (e.g. static production without proxy), try direct Google API if customKey is present
      if (customKey) {
        try {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${customKey}`;
          const directRes = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: { sampleCount: 1, aspectRatio }
            })
          });
          const directData = await directRes.json();
          if (directData?.predictions?.[0]?.bytesBase64Encoded) {
            const mime = directData.predictions[0].mimeType || 'image/jpeg';
            return {
              success: true,
              imageUrl: `data:${mime};base64,${directData.predictions[0].bytesBase64Encoded}`,
              promptUsed: prompt
            };
          }
        } catch (clientErr: any) {
          return { success: false, error: clientErr.message || 'Lỗi kết nối trực tiếp đến Gemini', promptUsed: prompt };
        }
      }
      return {
        success: false,
        error: err.message || 'Không thể kết nối đến dịch vụ tạo ảnh Gemini.',
        promptUsed: prompt
      };
    }
  }
};

