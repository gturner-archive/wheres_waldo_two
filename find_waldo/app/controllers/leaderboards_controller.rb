class LeaderboardsController < ApplicationController
  def index
    @leaderboards = Leaderboard.all
    render json: @leaderboards
  end

  def create
    @leaderboard = Leaderboard.new(leaderboard_params)
    if @leaderboard.save
      render json: @leaderboard
    end
  end

  private

    def leaderboard_params
      params.require(:leaderboard).permit(:name, :score)
    end
end
