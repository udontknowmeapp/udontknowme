defmodule Player do
  defstruct name: nil, points: 0

  def new(name), do: Agent.start_link(fn -> %Player{name: name} end)

  def get(p), do: Agent.get(p, &(&1))

  def add_points(p, add) do
    Agent.update(p, &(Map.merge(&1, %{points: &1.points + add})))
  end
end
