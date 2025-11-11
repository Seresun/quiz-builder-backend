import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createQuizDto: CreateQuizDto) {
    const { title, questions } = createQuizDto;

    return this.prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options ?? [],
          })),
        },
      },
      include: { questions: true },
    });
  }

  findAll() {
    return this.prisma.quiz
      .findMany({
        select: {
          id: true,
          title: true,
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      .then((quizzes) =>
        quizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          questionCount: quiz._count.questions,
        })),
      );
  }

  findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async remove(id: number) {
    const [, deletedQuiz] = await this.prisma.$transaction([
      this.prisma.question.deleteMany({
        where: { quizId: id },
      }),
      this.prisma.quiz.delete({
        where: { id },
      }),
    ]);

    return deletedQuiz;
  }
}

