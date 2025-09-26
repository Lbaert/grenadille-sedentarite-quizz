export interface AverageScoreData {
  age: number;
  score_moyen: number;
}

export const parseAverageScores = (csvContent: string): AverageScoreData[] => {
  const lines = csvContent.trim().split('\n');
  const data: AverageScoreData[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const [age, score_moyen] = lines[i].split(',');
    data.push({
      age: parseInt(age),
      score_moyen: parseFloat(score_moyen)
    });
  }
  
  return data;
};