class Token
  def self.authenticate(token)
    User.find_by(authentication_token: token)
  end
end
