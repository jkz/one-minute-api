class MatchesController < ApplicationController
  before_action :authenticate_user!

  def index
    @matches = current_user.matches.mutual
  end

  def create
    current_user.swipe(swipe_params[:user_id], swipe_params[:like])
    head :no_content
  end

  private

  def swipe_params
    params.permit(:user_id, :like)
  end
end
