class User < ActiveRecord::Base
  has_many :matches

  scope :targets, ->(user) { where.not(:TODO) }

  def match(params)
    Match.swipe(id, params[:id], params[:verdict])
  end
end
