import { NextRequest, NextResponse } from 'next/server';
import { ai, TUTOR_MODEL } from '@/lib/gemini';
import { WorldTheme } from '@/types/tutor';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      taskQuestion,
      studentAttempt,
      worldTheme = 'minecraft',
      hintLevel = 1,
      topicTitle,
    } = body;

    const themeDirectives: Record<WorldTheme, string> = {
      minecraft: `Мир Minecraft (блоки, крафт, стаки ресурсов по 64, сундук, координаты X/Z, мобы).`,
      space: `Мир Космоса (орбитальные скорости s = v*t, ступени ракет, стыковочные шлюзы, модули станции, датчики).`,
      music: `Мир Музыки (ритм 4/4 и 3/4, длительности нот 1/2, 1/4, 1/8, темп bpm, громкость, такты).`,
    };

    const prompt = `Ты — добрый и чуткий репетитор по математике для 5 класса «Архимед».
Ученик сейчас решает задачу из темы «${topicTitle || 'Математика'}»:
«${taskQuestion}»

Ученик дал такой ответ или задал вопрос:
«${studentAttempt || 'Я не понимаю, как решать'}»

Требуемый уровень помощи: УРОВЕНЬ ${hintLevel} из 3.
- Если Уровень 1: Задай ОДИН наводящий Сократовский вопрос, который помогает вспомнить ключевое правило или сделать первое действие.
- Если Уровень 2: Приведи наглядную метафору из мира (${themeDirectives[worldTheme as WorldTheme] || 'Minecraft'}), которая иллюстрирует логику шага.
- Если Уровень 3: Дай почти готовый шаблон с пропуском (например: «Чтобы узнать скорость, раздели расстояние ... на время ... . Что получится?»).

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
- Называть итоговое число или готовый результат!
- Писать длинный сложный текст. Максимум 2-3 коротких предложения. Дружелюбный тон.`;

    const response = await ai.models.generateContent({
      model: TUTOR_MODEL,
      contents: prompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 250,
      },
    });

    return NextResponse.json({
      hint: response.text?.trim() || 'Попробуй разбить задачу на два простых шага: что дано сначала и что нужно найти?',
    });
  } catch (error: any) {
    console.error('Tutor hint API error:', error);
    return NextResponse.json(
      {
        hint: 'Попробуй нарисовать схему задачи или представить её в виде блоков!',
      },
      { status: 500 }
    );
  }
}
