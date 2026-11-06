import { NextRequest, NextResponse } from 'next/server';
import { ai, TUTOR_MODEL } from '@/lib/gemini';
import { WorldTheme } from '@/types/tutor';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      currentTopicTitle,
      currentTaskContext,
      worldTheme = 'minecraft',
      studentName = 'Саша',
      studentLevel = '5 класс',
    } = body;

    const themeDirectives: Record<WorldTheme, string> = {
      minecraft: `Мир Minecraft: Используй метафоры блоков (1x1x1 м³), крафта верстака, координат X, Y, Z, стаков ресурсов по 64 предмета, сундуков (27 слотов), редстоун-цепей, добычи руды (уголь, железо, алмазы). Говори бодро, вдохновляюще, как опытный крафтер-наставник.`,
      space: `Мир Космоса: Используй метафоры космических экспедиций, ракет 'Восток' и 'Ангара', орбитальных скоростей v = s / t, модулей МКС, лунных кратеров, телеметрии, запаса топлива и кислорода. Говори как мудрый руководитель полёта и астрофизик.`,
      music: `Мир Музыки и Творчества: Используй метафоры музыкальных долей, тактов 4/4 и 3/4, длительностей нот (целая 1, половинная 1/2, четверть 1/4, восьмая 1/8), темпа bpm, дорожек в секвенсоре, микшеров и ритмов. Говори тепло, ритмично и творчески.`,
    };

    const systemInstruction = `Ты — «Архимед», персональный доброжелательный ИИ-репетитор по математике для ученика 5 класса (${studentName}).
Твоя главная миссия — развивать самостоятельное мышление и любовь к математике, объясняя всё на понятных примерах из любимого мира ученика.

Текущий активный мир ученика:
${themeDirectives[worldTheme as WorldTheme] || themeDirectives.minecraft}

Контекст урока прямо сейчас:
- Тема: ${currentTopicTitle || 'Математика 5 класс'}
- Текущая задача/вопрос: ${currentTaskContext || 'Общее обсуждение математической темы'}

ЖЕСТКИЕ ПЕДАГОГИЧЕСКИЕ ПРАВИЛА (СОКРАТОВСКИЙ МЕТОД):
1. НИКОГДА не выдавай сразу готовый численный ответ или итоговое решение задачи!
2. Если ученик спрашивает «Сколько будет?» или «Реши за меня» — ответь с улыбкой, разбей задачу на 1 маленький первый шаг и спроси: «А давай сначала посмотрим, что нам известно? Как думаешь...»
3. Если ученик ошибается — похвали за попытку! Ошибка — это ключ к открытию. Мягко обрати внимание на нестыковку («Представь, что в сундуке... почему не поместилось?»).
4. Если ученик отвечает правильно — искренне порадуйся и закрепи успех («В точку! Блоки встали идеально! Теперь следующий шаг...»).
5. Используй короткие, ясные реплики (не более 3-4 предложений за раз), чтобы не перегружать 5-классника. Всегда заканчивай реплику одним простым наводящим вопросом.
6. Используй ясную математическую запись на русском языке.`;

    const chatContents = (messages || []).map((m: { role: 'user' | 'assistant'; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // If chat is empty, return initial greeting
    if (chatContents.length === 0) {
      chatContents.push({
        role: 'user',
        parts: [{ text: `Привет, Архимед! Я готов к уроку.` }],
      });
    }

    const response = await ai.models.generateContent({
      model: TUTOR_MODEL,
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return NextResponse.json({
      text: response.text || 'Привет! Я тут, чтобы помочь тебе во всём разобраться. С чего начнём?',
    });
  } catch (error: any) {
    console.error('Tutor chat API error:', error);
    return NextResponse.json(
      {
        text: 'Кажется, связь с командным центром слегка забарахлила! Но не волнуйся, попробуй ещё раз или нажми кнопку подсказки под задачей.',
      },
      { status: 500 }
    );
  }
}
