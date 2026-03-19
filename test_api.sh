#!/bin/bash

API_KEY=$(grep DATA_GO_KR_KEY /Users/twinssn/Projects/certkorea/.env | cut -d'=' -f2 | tr -d ' \r\n')

echo "✅ API 키 로드 완료 (앞 10자리: ${API_KEY:0:10}...)"
echo ""

echo "========================================"
echo "1. 중앙부처 복지서비스"
echo "========================================"
R1=$(curl -s "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist?serviceKey=${API_KEY}&pageNo=1&numOfRows=3")
if echo "$R1" | grep -q "NORMAL SERVICE"; then echo "✅ 성공"
elif echo "$R1" | grep -q "NOT REGISTERED"; then echo "❌ 활용신청 필요"
else echo "⚠️ 확인필요"; echo "$R1" | head -5; fi

echo ""
echo "========================================"
echo "2. 지자체 복지서비스"
echo "========================================"
R2=$(curl -s "http://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist?serviceKey=${API_KEY}&pageNo=1&numOfRows=3")
if echo "$R2" | grep -q "NORMAL SERVICE"; then echo "✅ 성공"
elif echo "$R2" | grep -q "NOT REGISTERED"; then echo "❌ 활용신청 필요"
else echo "⚠️ 확인필요"; echo "$R2" | head -5; fi

echo ""
echo "========================================"
echo "3. 사회복지시설 정보서비스"
echo "========================================"
R3=$(curl -s "http://apis.data.go.kr/B554287/sclWlfrFcltInfoInqirService1/getNFcltBizInqire?serviceKey=${API_KEY}&pageNo=1&numOfRows=3")
if echo "$R3" | grep -q "NORMAL SERVICE"; then echo "✅ 성공"
elif echo "$R3" | grep -q "NOT REGISTERED"; then echo "❌ 활용신청 필요"
else echo "⚠️ 확인필요"; echo "$R3" | head -5; fi

echo ""
echo "========================================"
echo "📋 결과 요약"
echo "========================================"
echo "❌ 뜬 항목은 data.go.kr에서 활용신청이 필요합니다"
echo "1) https://www.data.go.kr/data/15090532/openapi.do"
echo "2) https://www.data.go.kr/data/15108347/openapi.do"
echo "3) https://www.data.go.kr/data/15001848/openapi.do"
