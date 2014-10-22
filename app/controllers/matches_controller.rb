class MatchesController < ApplicationController
  before_action :authenticate_user!

  def index
    @matches = current_user.matches.all
  end

  def swipe
    current_user.match(swipe_params)
    head :no_content
  end

  private

  def swipe_params
    params.require(:id, :verdict)
  end
end
