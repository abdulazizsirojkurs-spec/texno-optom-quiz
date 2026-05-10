#!/bin/bash
cd /Users/macbookpro/Desktop/Quize
git add .
git commit -m "Auto commit from Push-to-Github script"
git branch -M main
git push -u origin main
echo "==================================="
echo "Muvaffaqiyatli yuklandi!"
echo "==================================="
sleep 3
