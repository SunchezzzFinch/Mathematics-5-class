import { NextRequest, NextResponse } from 'next/server';
import { ai, TUTOR_MODEL } from '@/lib/gemini';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName = 'Саша',
      stats,
      weakTopics = [],
      recentAttempts = [],
    } = body;

    const prompt = `Ты — старший методист и детский психолог образовательной платформы.
Составь краткий, тёплый, профессиональный и мотивирующий отчёт для родителей ученика 5 класса (${studentName}).

Текущие показатели ребёнка:
- Общий опыт (XP): ${stats?.xp || 0}
- Решённых заданий: ${stats?.solvedTasksCount || 0}
- Ударный темп (серия дней): ${stats?.streakDays || 1}
- Индекс самостоятельности (решено без подсказок): ${stats?.independenceScore || 75}%
- Общее время занятий: ${Math.round((stats?.totalMinutesSpent || 18))} минут
- Темы, требующие повторения и внимания: ${weakTopics.length > 0 ? weakTopics.map((w: any) => w.topicTitle).join(', ') : 'Все базовые темы усваиваются ровно'}

Структура отчёта (в формате понятных блоков):
1. **Главный прогресс**: Что получается особенно здорово, за что обязательно похвалить ребёнка сегодня вечером.
2. **Точки роста**: 1-2 конкретных момента без стресса и критики (например, аккуратность в делении с остатком или перевод дробей в смешанные числа).
3. **Совет для дома**: Одно бытовое игровое упражнение для родителей с ребёнком (например, на кухне с пиццей/пирогом или при планировании поездки), укрепляющее уверенность.

Тон: заботливый, оптимистичный, уважительный, без занудства и штампов. Длина 150-200 слов.`;

    const response = await ai.models.generateContent({
      model: TUTOR_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    return NextResponse.json({
      summary: response.text?.trim() || 'Саша делает отличные успехи в 5 классе! Главное — поддерживать интерес и регулярность.',
    });
  } catch (error: any) {
    console.error('Parent summary API error:', error);
    return NextResponse.json(
      {
        summary: 'Саша уверенно осваивает темы 5 класса. Регулярные 15-минутные подходы дают ощутимый прирост понимания.',
      },
      { status: 500 }
    );
  }
}
