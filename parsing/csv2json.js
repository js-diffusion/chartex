const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

// CSV 파일이 저장된 폴더 경로
const csvFolderPath = path.join(__dirname, 'data');
// JSON 파일이 저장될 폴더 경로
const jsonFolderPath = path.join(__dirname, '../public/data');

// JSON 폴더가 없으면 생성
if (!fs.existsSync(jsonFolderPath)) {
  fs.mkdirSync(jsonFolderPath);
}

// 폴더 내의 모든 CSV 파일을 읽어 JSON으로 변환
fs.readdir(csvFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading CSV folder:', err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === '.csv') {
      const csvFilePath = path.join(csvFolderPath, file);
      const jsonFilePath = path.join(jsonFolderPath, path.basename(file, '.csv') + '.json');

      // CSV 파일을 버퍼로 읽기
      fs.readFile(csvFilePath, (err, buffer) => {
        if (err) {
          console.error('Error reading CSV file:', err);
          return;
        }

        // 버퍼를 올바른 인코딩으로 디코딩
        const csvData = iconv.decode(buffer, 'EUC-KR');

        Papa.parse(csvData, {
          header: true,
          complete: (result) => {
            const jsonData = JSON.stringify(result.data, null, 2);

            fs.writeFile(jsonFilePath, jsonData, 'utf8', (err) => {
              if (err) {
                console.error('Error writing JSON file:', err);
                return;
              }

              console.log(`CSV file ${file} has been converted to JSON and saved as ${path.basename(jsonFilePath)}`);
            });
          },
          error: (err) => {
            console.error('Error parsing CSV data:', err);
          }
        });
      });
    }
  });
});
