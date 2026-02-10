import { Request, Response } from "express";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  bfhlRequestSchema,
  validateSingleKey,
  FibonacciRequest,
  PrimeRequest,
  LcmRequest,
  HcfRequest,
  AIRequest,
} from "../schemas/bfhl.request";

const OFFICIAL_EMAIL =
  process.env.OFFICIAL_EMAIL || "yasir0393.be23@chitkara.edu.in";

const generateFibonacci = (n: number): number[] => {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const fib: number[] = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
};

const filterPrimes = (numbers: number[]): number[] => {
  return numbers.filter(isPrime);
};

const gcd = (a: number, b: number): number => {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
};

const calculateHCF = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => gcd(acc, num));
};

const lcmTwo = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

const calculateLCM = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => lcmTwo(acc, num));
};

const getAIResponse = async (question: string): Promise<string> => {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Answer the following question with a SINGLE WORD only. Do not provide explanations, just one word.\n\nQuestion: ${question}\n\nAnswer:`,
      temperature: 0.3,
    });

    const firstWord = text
      .trim()
      .split(/\s+/)[0]
      .replace(/[.,!?;:'"()]/g, "");
    return firstWord || "Unknown";
  } catch (error) {
    console.error("AI Error:", error);
    return "Unknown";
  }
};

export const handleBfhlPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        message: "Request body is required",
      });
      return;
    }

    if (!validateSingleKey(req.body)) {
      res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        message:
          "Request must contain exactly one operation key: fibonacci, prime, lcm, hcf, or AI",
      });
      return;
    }

    const parseResult = bfhlRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        message:
          "Invalid request format: " + parseResult.error.issues[0].message,
      });
      return;
    }

    const data = parseResult.data;

    if ("fibonacci" in data) {
      const fibData = data as FibonacciRequest;
      const result = generateFibonacci(fibData.fibonacci);
      res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: result,
      });
    } else if ("prime" in data) {
      const primeData = data as PrimeRequest;
      if (primeData.prime.length === 0) {
        res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          message: "Prime array requires at least one value",
        });
        return;
      }
      const result = filterPrimes(primeData.prime);
      res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: result,
      });
    } else if ("lcm" in data) {
      const lcmData = data as LcmRequest;
      if (lcmData.lcm.length === 0) {
        res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          message: "LCM array requires at least one value",
        });
        return;
      }
      const result = calculateLCM(lcmData.lcm);
      res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: result,
      });
    } else if ("hcf" in data) {
      const hcfData = data as HcfRequest;
      if (hcfData.hcf.length === 0) {
        res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          message: "HCF array requires at least one value",
        });
        return;
      }
      const result = calculateHCF(hcfData.hcf);
      res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: result,
      });
    } else if ("AI" in data) {
      const aiData = data as AIRequest;
      const result = await getAIResponse(aiData.AI);
      res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: result,
      });
    } else {
      res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        message: "Unknown operation",
      });
    }
  } catch (error) {
    console.error("Error in handleBfhlPost:", error);
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      message: "Internal server error",
    });
  }
};

export const handleHealthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
};
