import PDFDocument from 'pdfkit';
import { Exam } from '../types/Exam';
import { Question, Alternative } from '../types/Question';

export interface RandomizedQuestion {
  originalIndex: number;
  question: Question;
  shuffledAlternatives: Array<{
    original: Alternative;
    newIndex: number;
  }>;
}

export interface ExamCopy {
  copyNumber: number;
  questions: RandomizedQuestion[];
  answers: string[];
}

export class PDFGenerator {
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  generateRandomizedCopies(
    exam: Exam,
    questions: Question[],
    numberOfCopies: number
  ): ExamCopy[] {
    const copies: ExamCopy[] = [];

    for (let copyNum = 1; copyNum <= numberOfCopies; copyNum++) {
      // Randomizar ordem das questões
      const questionOrder = this.shuffleArray(
        questions.map((q, idx) => ({ question: q, originalIndex: idx }))
      );

      const randomizedQuestions: RandomizedQuestion[] = questionOrder.map(({ question, originalIndex }) => {
        // Randomizar ordem das alternativas
        const altOrder = this.shuffleArray(
          question.alternatives.map((alt, idx) => ({ original: alt, newIndex: idx }))
        );

        return {
          originalIndex,
          question,
          shuffledAlternatives: altOrder
        };
      });

      // Calcular gabarito
      const answers = this.calculateAnswers(randomizedQuestions, exam.identificationType);

      copies.push({
        copyNumber: copyNum,
        questions: randomizedQuestions,
        answers
      });
    }

    return copies;
  }

  private calculateAnswers(
    questions: RandomizedQuestion[],
    identificationType: 'letters' | 'powers'
  ): string[] {
    return questions.map(rq => {
      const correctAlts = rq.shuffledAlternatives
        .map((sa, idx) => ({ ...sa, shuffledIndex: idx }))
        .filter(sa => sa.original.isCorrect);

      if (identificationType === 'letters') {
        // Retornar letras das alternativas corretas
        return correctAlts
          .map(ca => String.fromCharCode(65 + ca.shuffledIndex))
          .sort()
          .join(', ');
      } else {
        // Retornar soma das potências
        const sum = correctAlts.reduce((acc, ca) => acc + Math.pow(2, ca.shuffledIndex), 0);
        return sum.toString();
      }
    });
  }

  async generatePDF(
    exam: Exam,
    copies: ExamCopy[],
    stream: NodeJS.WritableStream
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        doc.pipe(stream);

        // Gerar cada cópia
        copies.forEach((examCopy, copyIndex) => {
          if (copyIndex > 0) {
            doc.addPage(); // Nova página para cada cópia (exceto a primeira)
          }

          // Cabeçalho
          this.addHeader(doc, exam, examCopy.copyNumber);
          
          doc.moveDown(2);

          // Instruções
          this.addInstructions(doc, exam.identificationType);
          
          doc.moveDown(1);

          // Questões
          examCopy.questions.forEach((rq, qIndex) => {
            this.addQuestion(doc, rq, qIndex + 1, exam.identificationType);
          });

          // Espaço para identificação do aluno
          this.addStudentInfo(doc);
          
          // Rodapé na página atual
          this.addFooter(doc, examCopy.copyNumber);
        });

        doc.end();
        
        doc.on('finish', () => resolve());
        doc.on('error', (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, exam: Exam, copyNumber: number): void {
    doc.fontSize(16).font('Helvetica-Bold').text(exam.title, { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Helvetica');
    if (exam.header.institution) {
      doc.text(exam.header.institution, { align: 'center' });
    }
    doc.text(`Disciplina: ${exam.header.discipline}`, { align: 'center' });
    doc.text(`Professor(a): ${exam.header.professor}`, { align: 'center' });
    doc.text(`Data: ${exam.header.date}`, { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(8).fillColor('#666666').text(`Prova Nº ${copyNumber}`, { align: 'center' });
    doc.fillColor('#000000');
    
    // Linha separadora
    doc.moveTo(50, doc.y + 10)
       .lineTo(545, doc.y + 10)
       .stroke();
  }

  private addInstructions(doc: PDFKit.PDFDocument, identificationType: 'letters' | 'powers'): void {
    doc.fontSize(9).font('Helvetica-Bold').text('INSTRUÇÕES:', { continued: false });
    doc.fontSize(8).font('Helvetica');
    
    if (identificationType === 'letters') {
      doc.text('• Marque as letras das alternativas corretas no espaço indicado ao final de cada questão.', { indent: 10 });
      doc.text('• Você pode marcar mais de uma alternativa por questão, se aplicável.', { indent: 10 });
    } else {
      doc.text('• Some os valores das alternativas corretas e escreva o resultado no espaço indicado.', { indent: 10 });
      doc.text('• Cada alternativa tem um valor em potência de 2 (1, 2, 4, 8, 16...).', { indent: 10 });
    }
  }

  private addQuestion(
    doc: PDFKit.PDFDocument,
    rq: RandomizedQuestion,
    questionNumber: number,
    identificationType: 'letters' | 'powers'
  ): void {
    // Verificar se precisa de nova página
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`${questionNumber}. ${rq.question.statement}`, { continued: false });
    doc.moveDown(0.3);

    // Alternativas
    doc.fontSize(9).font('Helvetica');
    rq.shuffledAlternatives.forEach((sa, idx) => {
      const identifier = identificationType === 'letters'
        ? String.fromCharCode(65 + idx)
        : Math.pow(2, idx).toString();
      
      const prefix = identificationType === 'letters' 
        ? `${identifier}) ` 
        : `(${identifier}) `;
      
      doc.text(prefix + sa.original.description, { indent: 15 });
    });

    doc.moveDown(0.5);

    // Espaço para resposta
    doc.fontSize(8).font('Helvetica-Oblique');
    const answerLabel = identificationType === 'letters'
      ? 'Alternativas marcadas: '
      : 'Soma das alternativas: ';
    
    doc.text(answerLabel + '_'.repeat(30), { indent: 15 });
    doc.moveDown(1);
  }

  private addStudentInfo(doc: PDFKit.PDFDocument): void {
    // Ir para nova página se necessário
    if (doc.y > 600) {
      doc.addPage();
    } else {
      doc.moveDown(2);
    }

    // Linha separadora
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke();
    
    doc.moveDown(1);
    
    doc.fontSize(10).font('Helvetica-Bold').text('IDENTIFICAÇÃO DO ALUNO', { align: 'center' });
    doc.moveDown(1);
    
    doc.fontSize(9).font('Helvetica');
    doc.text('Nome completo: ' + '_'.repeat(70));
    doc.moveDown(1);
    doc.text('CPF: ' + '_'.repeat(30));
    doc.moveDown(1);
    doc.text('Assinatura: ' + '_'.repeat(50));
  }

  private addFooter(doc: PDFKit.PDFDocument, copyNumber: number): void {
    const bottomMargin = 30;
    doc.fontSize(8)
       .font('Helvetica-Oblique')
       .fillColor('#666666')
       .text(
         `Prova Nº ${copyNumber}`,
         50,
         doc.page.height - bottomMargin,
         { align: 'center' }
       )
       .fillColor('#000000');
  }

  generateCSV(exam: Exam, copies: ExamCopy[]): string {
    const header = ['Prova', ...copies[0].questions.map((_, idx) => `Q${idx + 1}`)].join(',');
    
    const rows = copies.map(copy => {
      return [copy.copyNumber.toString(), ...copy.answers].join(',');
    });

    return [header, ...rows].join('\n');
  }
}

export default new PDFGenerator();
