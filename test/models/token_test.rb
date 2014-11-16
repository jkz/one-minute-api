require 'test_helper'

class TokenTest < ActiveSupport::TestCase
  test "authenticate" do
    expected = User.first
    user = Token.authenticate(expected.authentication_token)
    assert_equal user, expected

    user = Token.authenticate('wrong')
    assert_not user
  end
end
