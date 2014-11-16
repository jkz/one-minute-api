class MatchesController < ApplicationController
  before_action :authenticate_user!

  def index
    @matches = current_user.matches.mutual
  end

  def update
    current_user.match(swipe_params)
    head :no_content
  end

  private

  def swipe_params
    params.permit(:id, :like)
  end
end
