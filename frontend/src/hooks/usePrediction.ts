import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePrediction(articleId: string) {
  return useQuery({
    queryKey: ["prediction", articleId],
    queryFn: () => api.getArticlePrediction(articleId),
    enabled: !!articleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePredictionStatus(predictionId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["prediction-status", predictionId],
    queryFn: () => api.getPredictionStatus(predictionId),
    enabled: enabled && !!predictionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 3000; // poll every 3s while running
    },
  });
}

export function useTriggerSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      articleId,
      options,
    }: {
      articleId: string;
      options?: { agent_count?: number; simulation_rounds?: number; prediction_focus?: string };
    }) => api.triggerSimulation(articleId, options),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["prediction", variables.articleId],
      });
    },
  });
}

export function usePredictionChat() {
  return useMutation({
    mutationFn: (request: {
      prediction_id: string;
      message: string;
      history: { role: string; content: string }[];
    }) => api.chatWithPrediction(request),
  });
}

export function useAgentInterview() {
  return useMutation({
    mutationFn: (request: {
      prediction_id: string;
      agent_perspective_id: string;
      question: string;
    }) => api.interviewAgent(request),
  });
}

export function useTrendingPredictions(limit: number = 20) {
  return useQuery({
    queryKey: ["trending-predictions", limit],
    queryFn: () => api.getTrendingPredictions(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
