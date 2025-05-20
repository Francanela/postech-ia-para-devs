
# 🤖 Tech Challenge – Grupo 23

Este projeto realiza a análise de um vídeo com detecção de **rostos**, **emoções** e **atividades**, usando técnicas modernas de Visão Computacional, Redes Neurais e Modelos de Linguagem Natural (LLM).

---

## 🧩 Etapas do Pipeline

1. 📥 **Upload do vídeo**
2. 🎯 **Detecção de pose corporal** com MediaPipe (33 keypoints/frame)
3. 🧠 **Classificação de atividades** usando rede neural MLP (Keras)
4. 😐 **Detecção de rostos** com MTCNN
5. 😊 **Análise emocional facial** com DeepFace
6. 📦 **Geração do `summary.txt`** com:
   - Frame
   - Atividade
   - Emoções
   - Coordenadas dos rostos
7. 💬 **Geração de resumo textual com OpenAI GPT-3.5**
8. 🎬 **Geração de vídeo anotado** com caixas reais e informações sobre cada frame..


---

## 📦 Arquivos Gerados

- `summary.txt`: Relatório com atividades, emoções e bounding boxes por frame
- `activity_labels_v2.csv`: Rótulos manuais usados no treinamento
- `annotated_summary.mp4`: Vídeo final com anotações visuais
- `tech_challenge_final_video_analysis_with_face_coords_Grupo 23.ipynb`: Código completo
- `README.md`: Este documento

---

## 🧠 Bibliotecas utilizadas

| Pacote                    | Função principal                                                              |
|---------------------------|-------------------------------------------------------------------------------|
| `facenet-pytorch`         | Detecção facial com MTCNN                                                     |
| `deepface`                | Análise emocional em rostos                                                   |
| `mediapipe`               | Extração de keypoints corporais com Pose Estimation                           |
| `opencv-python-headless`  | Processamento de vídeo e desenho de caixas/barras                             |
| `tqdm`                    | Barra de progresso (pode ser usada em loops longos)                           |
| `pandas`                  | Manipulação de dados tabulares                                                |
| `tensorflow`              | Treinamento de rede neural para classificação de atividades                   |
| `openai`                  | Geração de resumo textual com modelo GPT (requere chave de API)               |
 
---

## 🚀 Execução no Google Colab

1. Faça upload dos seguintes arquivos:
   - `output_compressed.mp4` (vídeo)
   - `activity_labels_v2.csv` (rótulos)
2. Execute o notebook sequencialmente
3. O `summary.txt` será gerado automaticamente
4. A penúltima célula chama a OpenAI API para gerar um resumo do vídeo
5. A última célula gera o vídeo anotado (`annotated_summary.mp4`)

> OBRIGATÓRIO:💡 Certifique-se de configurar a variável `OPENAI_API_KEY` via `userdata` ou `getpass()` no ambiente Colab.

---


## 👥 Participantes

- **Alex de Agostini Batista** — alexxx.batista@gmail.com  
- **Cesar Jesus Silva** — cesar.jesus.silva@hotmail.com
- **Alexandre Francanela Junior** — alexandre.francanela@gmail.com  
- **Luis Felipe Bortolatto da Cunha** — luisfelipebc@outlook.com  
- **Maciel Ferreira Custódio Júnior** — maciel_custodio@icloud.com  

Projeto desenvolvido para entrega do: **Grupo 23 – Tech Challenge Fase 4**  

---
