// Download and Extract transcript audio

import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import OpenAI from "openai";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const openai = new OpenAI();

/**
 * Downloads the audio from a YouTube video and extracts it as a WAV file.
 *
 * @param videoId - The YouTube video ID or URL.
 * @param outputPath - The file path where the extracted audio will be saved.
 * @returns A Promise that resolves when the audio has been successfully saved, or rejects if an error occurs.
 *
 * How it works:
 * - Uses ytdl-core to stream only the audio from the YouTube video.
 * - Pipes the audio stream into ffmpeg, which converts it to WAV format with PCM 16-bit encoding.
 * - Saves the resulting audio to the specified output path.
 */
export async function downloadAndExtractAudio(videoId: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const audioStream = ytdl(videoId, { filter: 'audioonly' });
    ffmpeg(audioStream)
      .audioCodec('pcm_s16le')
      .format('wav')
      .save(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

/**
 * Transcribes an audio file using OpenAI's Whisper API.
 *
 * @param audioPath - The path to the audio file to transcribe.
 * @returns A Promise that resolves to the transcription result.
 *
 * How it works:
 * - Uses OpenAI's Whisper API to transcribe the audio file.
 * - Returns the transcription result.
*/
export async function transcribeWithWhisper(audioPath: string) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"]
  });
  return transcription; // or transcription.words, or transcription.text, as needed
}	
