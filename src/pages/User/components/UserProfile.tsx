import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Divider } from 'antd';
import PropTypes from 'prop-types'; // 这个库用于定义组件的props的类型
import './UserProfile.less';

// @ts-ignore
const UserProfile = ({ friendMessage, onCall, onMessage, onVideo }) => {
  // @ts-ignore
  return (
    <div className="user-profile">
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <Avatar shape="square" size={64} src={friendMessage.avatarUrl} />
          </div>
          <span style={{ paddingLeft: 20 }}>
            <div>
              {friendMessage.userName}
              <UserOutlined style={{ color: '#1760e7' }} />
            </div>
            <div style={{ color: '#9E9E9E' }}>微信号：{friendMessage.numberId}</div>
            <div style={{ color: '#9E9E9E' }}>地区：{friendMessage.area}</div>
          </span>
        </div>
      </div>
      <Divider />
      <div>
        {friendMessage.status === 'none' ? (
          <></>
        ) : (
          <>
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ color: '#9E9E9E' }}>
                  状态
                  <span
                    style={{ paddingLeft: 20 }}
                    className={`user-status ${
                      friendMessage.status === 'online' ? 'online' : 'offline'
                    }`}
                  >
                    {friendMessage.status === 'online' ? '在线' : '离线'}
                  </span>
                </div>
              </div>
            </div>
            <Divider />
          </>
        )}
      </div>
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <div style={{ color: '#9E9E9E' }}>
              <div style={{ color: '#9E9E9E' }}>
                备注<span style={{ paddingLeft: 20 }}>{friendMessage.alias}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <div style={{ color: '#9E9E9E' }}>
              <div style={{ color: '#9E9E9E' }}>
                个性签名<span style={{ paddingLeft: 20 }}>{friendMessage.signature}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={onMessage}>
            <FontAwesomeIcon
              icon={faComment}
              style={{
                fontSize: 25,
              }}
            />
            <div>发消息</div>
          </div>
          <div style={{ paddingLeft: 50, textAlign: 'center', cursor: 'pointer' }} onClick={onCall}>
            <PhoneOutlined
              style={{
                fontSize: 25,
              }}
            />
            <div>语音聊天</div>
          </div>
          <div style={{ paddingLeft: 50, textAlign: 'center', cursor: 'pointer' }} onClick={onVideo}>
            <FontAwesomeIcon
              icon={faVideo}
              style={{
                fontSize: 25,
              }}
            />
            <div>视频聊天</div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  friendMessage: PropTypes.object as API.FriendMessage,
  onCall: PropTypes.func,
  onMessage: PropTypes.func,
  onVideo: PropTypes.func,
};

UserProfile.defaultProps = {
  status: 'offline', // 默认用户状态为离线
  onCall: () => {},
  onMessage: () => {},
  onVideo: () => {},
};

export default UserProfile;
