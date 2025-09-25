import { Injectable } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import * as fs from 'node:fs/promises';

@Injectable()
export class DocentService {
  private client = new BedrockRuntimeClient({
    region: process.env.AWS_BEDROCK_REGION,
  });

  async makeAnswer(
    gps_data: string,
    img_filePath: string,
    img_mediaType: string,
    question: string,
  ): Promise<string> {
    const img_buf = await fs.readFile(img_filePath);
    const img_base64 = img_buf.toString('base64');

    const prompt = [
      '넌 서울 여행 안내자야.',
      `질문: ${question}`,
      `지도 gps: ${gps_data}`,
      `이미지: (직접 업로드됨)}`,
      '사용자가 물어본 언어를 토대로 사용자에게 해당 이미지와 지도 정보를 확인해 대답해줘.',
    ].join('\n');

    const resp = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: img_base64,
              },
            },
          ],
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: new TextEncoder().encode(JSON.stringify(resp)), // 바잍트 배열로 변환환
    });

    const res = await this.client.send(command);
    const json = JSON.parse(new TextDecoder().decode(res.body));
    const answer =
      json?.content
        ?.map((c: any) => c?.text)
        .filter(Boolean)
        .join('\n')
        .trim() || '';
    return answer;
  }
}
