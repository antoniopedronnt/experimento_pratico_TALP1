import { parse } from 'csv-parse/sync';
import { StudentAnswer, AnswerKey, StudentGrade, QuestionGrade, GradingMode, GradeReport } from '../types/Grading';

export class GradingService {
  parseAnswerKeyCSV(csvContent: string): AnswerKey[] {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any) => {
      const examNumber = parseInt(record['Prova'] || record['prova']);
      const answers: string[] = [];
      
      // Extrair todas as colunas Q1, Q2, Q3, etc.
      let questionNum = 1;
      while (record[`Q${questionNum}`]) {
        answers.push(record[`Q${questionNum}`].trim());
        questionNum++;
      }

      return {
        examNumber,
        correctAnswers: answers
      };
    });
  }

  parseStudentAnswersCSV(csvContent: string): StudentAnswer[] {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const seenExamNumbers = new Set<number>();
    const studentAnswers: StudentAnswer[] = [];

    for (const record of records) {
      const examNumber = parseInt(record['Prova'] || record['prova'] || record['Numero da Prova']);
      
      if (isNaN(examNumber)) {
        throw new Error(`Número de prova inválido: ${record['Prova']}`);
      }

      if (seenExamNumbers.has(examNumber)) {
        throw new Error(`Número de prova duplicado: ${examNumber}. Cada aluno deve ter um número de prova único.`);
      }
      seenExamNumbers.add(examNumber);

      const answers: string[] = [];
      
      // Extrair todas as colunas Q1, Q2, Q3, etc.
      let questionNum = 1;
      while (record[`Q${questionNum}`] !== undefined) {
        answers.push(record[`Q${questionNum}`].trim());
        questionNum++;
      }

      studentAnswers.push({
        examNumber,
        answers
      });
    }

    return studentAnswers;
  }

  gradeExam(
    studentAnswer: StudentAnswer,
    answerKey: AnswerKey,
    mode: GradingMode,
    identificationType: 'letters' | 'powers'
  ): StudentGrade {
    const questionGrades: QuestionGrade[] = [];
    let totalScore = 0;
    const maxScorePerQuestion = 10; // 10 pontos por questão
    const totalQuestions = answerKey.correctAnswers.length;
    const maxScore = maxScorePerQuestion * totalQuestions;

    for (let i = 0; i < answerKey.correctAnswers.length; i++) {
      const correctAnswer = answerKey.correctAnswers[i];
      const studentAns = studentAnswer.answers[i] || '';
      
      const score = this.gradeQuestion(
        studentAns,
        correctAnswer,
        mode,
        identificationType,
        maxScorePerQuestion
      );

      questionGrades.push({
        questionNumber: i + 1,
        studentAnswer: studentAns,
        correctAnswer: correctAnswer,
        score,
        maxScore: maxScorePerQuestion
      });

      totalScore += score;
    }

    return {
      examNumber: studentAnswer.examNumber,
      questionGrades,
      totalScore,
      maxScore,
      percentage: (totalScore / maxScore) * 100
    };
  }

  private gradeQuestion(
    studentAnswer: string,
    correctAnswer: string,
    mode: GradingMode,
    identificationType: 'letters' | 'powers',
    maxScore: number
  ): number {
    if (identificationType === 'letters') {
      return this.gradeLettersQuestion(studentAnswer, correctAnswer, mode, maxScore);
    } else {
      return this.gradePowersQuestion(studentAnswer, correctAnswer, mode, maxScore);
    }
  }

  private gradeLettersQuestion(
    studentAnswer: string,
    correctAnswer: string,
    mode: GradingMode,
    maxScore: number
  ): number {
    // Normalizar respostas: remover espaços, converter para maiúsculas, separar por vírgula
    const studentLetters = this.parseLetters(studentAnswer);
    const correctLetters = this.parseLetters(correctAnswer);

    if (mode === 'strict') {
      // Modo rigoroso: todas as letras devem estar corretas
      const isCorrect = 
        studentLetters.length === correctLetters.length &&
        studentLetters.every(l => correctLetters.includes(l));
      
      return isCorrect ? maxScore : 0;
    } else {
      // Modo proporcional
      return this.calculateProportionalScore(studentLetters, correctLetters, maxScore);
    }
  }

  private gradePowersQuestion(
    studentAnswer: string,
    correctAnswer: string,
    mode: GradingMode,
    maxScore: number
  ): number {
    const studentSum = parseInt(studentAnswer) || 0;
    const correctSum = parseInt(correctAnswer) || 0;

    if (mode === 'strict') {
      // Modo rigoroso: a soma deve ser exatamente igual
      return studentSum === correctSum ? maxScore : 0;
    } else {
      // Modo proporcional: calcular com base nas alternativas
      // Decompomos a soma em potências de 2
      const studentPowers = this.decomposeToPowers(studentSum);
      const correctPowers = this.decomposeToPowers(correctSum);
      
      return this.calculateProportionalScore(studentPowers, correctPowers, maxScore);
    }
  }

  private parseLetters(answer: string): string[] {
    if (!answer) return [];
    
    // Remover espaços e separar por vírgula ou espaço
    return answer
      .toUpperCase()
      .replace(/\s/g, '')
      .split(/[,;]/)
      .filter(l => l.length > 0)
      .map(l => l.trim());
  }

  private decomposeToPowers(sum: number): number[] {
    const powers: number[] = [];
    let remaining = sum;
    let power = 0;

    while (remaining > 0) {
      if (remaining % 2 === 1) {
        powers.push(Math.pow(2, power));
      }
      remaining = Math.floor(remaining / 2);
      power++;
    }

    return powers;
  }

  private calculateProportionalScore(
    studentAnswers: any[],
    correctAnswers: any[],
    maxScore: number
  ): number {
    if (correctAnswers.length === 0) return 0;

    // Contar acertos e erros
    const correctlySelected = studentAnswers.filter(a => correctAnswers.includes(a)).length;
    const incorrectlySelected = studentAnswers.filter(a => !correctAnswers.includes(a)).length;
    const notSelected = correctAnswers.filter(a => !studentAnswers.includes(a)).length;

    const totalAlternatives = correctAnswers.length + incorrectlySelected;
    const totalCorrect = correctlySelected;
    const totalErrors = incorrectlySelected + notSelected;

    // Score proporcional baseado no percentual de acertos
    const accuracyRate = totalAlternatives > 0 
      ? (correctlySelected / correctAnswers.length) - (incorrectlySelected / Math.max(1, totalAlternatives))
      : 0;

    const score = Math.max(0, accuracyRate * maxScore);
    return Math.round(score * 100) / 100; // Arredondar para 2 casas decimais
  }

  generateGradeReport(
    studentAnswers: StudentAnswer[],
    answerKeys: AnswerKey[],
    mode: GradingMode,
    identificationType: 'letters' | 'powers'
  ): GradeReport {
    const studentGrades: StudentGrade[] = [];

    for (const studentAnswer of studentAnswers) {
      const answerKey = answerKeys.find(ak => ak.examNumber === studentAnswer.examNumber);
      
      if (!answerKey) {
        console.warn(`No answer key found for exam ${studentAnswer.examNumber}`);
        continue;
      }

      const grade = this.gradeExam(studentAnswer, answerKey, mode, identificationType);
      studentGrades.push(grade);
    }

    // Calcular estatísticas
    const percentages = studentGrades.map(g => g.percentage);
    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length || 0;
    const sortedPercentages = [...percentages].sort((a, b) => a - b);
    const median = sortedPercentages.length > 0
      ? sortedPercentages.length % 2 === 0
        ? (sortedPercentages[sortedPercentages.length / 2 - 1] + sortedPercentages[sortedPercentages.length / 2]) / 2
        : sortedPercentages[Math.floor(sortedPercentages.length / 2)]
      : 0;
    const highest = Math.max(...percentages, 0);
    const lowest = Math.min(...percentages, 0);
    const passRate = percentages.filter(p => p >= 60).length / percentages.length * 100 || 0;

    return {
      gradingMode: mode,
      studentGrades,
      statistics: {
        average: Math.round(average * 100) / 100,
        median: Math.round(median * 100) / 100,
        highest: Math.round(highest * 100) / 100,
        lowest: Math.round(lowest * 100) / 100,
        passRate: Math.round(passRate * 100) / 100
      }
    };
  }

  generateReportCSV(report: GradeReport): string {
    const headers = ['Prova', 'Nota', 'Nota Máxima', 'Percentual'];
    
    const rows = report.studentGrades.map(sg => [
      sg.examNumber.toString(),
      sg.totalScore.toFixed(2),
      sg.maxScore.toString(),
      sg.percentage.toFixed(2) + '%'
    ]);

    // Adicionar linha de estatísticas
    rows.push([]);
    rows.push(['ESTATÍSTICAS', '', '', '']);
    rows.push(['Média', '', '', report.statistics.average.toFixed(2) + '%']);
    rows.push(['Mediana', '', '', report.statistics.median.toFixed(2) + '%']);
    rows.push(['Maior Nota', '', '', report.statistics.highest.toFixed(2) + '%']);
    rows.push(['Menor Nota', '', '', report.statistics.lowest.toFixed(2) + '%']);
    rows.push(['Taxa de Aprovação (≥60%)', '', '', report.statistics.passRate.toFixed(2) + '%']);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export default new GradingService();
