require 'securerandom'

class User < ActiveRecord::Base
  # Select all user that don't have a match with this one
  # TODO order by relevance (distance, likes)
  # TODO filter by preferences
  scope :in_radius, ->(distance) { where(:TODO) }

  # For targets of a given user, we need ALL users that he has not swiped for
  User.all.joins(:matches)

  before_save :ensure_authentication_token
  before_save :ensure_public_id

  def targets
    # TODO lolwat sqlinjection
    User
      .all
      .where.not(id: id)
      .joins("LEFT OUTER JOIN matches AS matches_1 ON matches_1.user_1_id = users.id AND matches_1.user_2_id = #{id}")
      .where("matches_1.user_2_like IS NULL") # AND NOT matches_1.user_1_like = 'f'")
      .joins("LEFT OUTER JOIN matches AS matches_2 ON matches_2.user_2_id = users.id AND matches_2.user_1_id = #{id}")
      .where("matches_2.user_1_like IS NULL") # AND NOT matches_2.user_2_like = 'f'")
  end

  def matches
    Match.of_user(self)
  end

  def swipe(other, like)
    Match.swipe(self, other, like)
  end

  def ensure_authentication_token
    self.authentication_token = generate_authentication_token if authentication_token.blank?
  end

  def ensure_public_id
    self.public_id = generate_public_id if public_id.blank?
  end

  private

  def generate_authentication_token
    loop do
      token = SecureRandom.hex
      break token unless User.find_by(authentication_token: token)
    end
  end

  def generate_public_id
    loop do
      token = SecureRandom.hex
      break token unless User.find_by(public_id: token)
    end
  end
end
