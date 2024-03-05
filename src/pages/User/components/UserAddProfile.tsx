import { UserOutlined } from '@ant-design/icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModel } from '@umijs/max';
import { Avatar, Divider } from 'antd';
import PropTypes from 'prop-types'; // 这个库用于定义组件的props的类型
import './UserAddProfile.less';

// @ts-ignore
const UserAddProfile = ({ friendMessage, onAdd, onMessage }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // @ts-ignore
  return (
    <div className="user-profile">
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <Avatar shape="square" size={64} src={friendMessage.avatar} />
          </div>
          <span style={{ paddingLeft: 20 }}>
            <div>
              {friendMessage.name}
              <UserOutlined style={{ color: '#1760e7' }} />
            </div>
            {friendMessage.type === 1 ? (
              <></>
            ) : (
              <div style={{ color: '#9E9E9E' }}>微信号：{friendMessage.uid}</div>
            )}
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
          </>
        )}
      </div>
      <Divider />
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <div style={{ color: '#9E9E9E' }}>
              <div style={{ color: '#9E9E9E' }}>
                个性签名<span style={{ paddingLeft: 20 }}>{friendMessage.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {friendMessage.uid === currentUser?.id ? (
        <></>
      ) : (
        <>
          <Divider />
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {Number(friendMessage.friendTarget) !== 1 ? (
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={onAdd}>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{
                      fontSize: 25,
                    }}
                  />
                  <div>添加{friendMessage.type === 1 ? '群聊' : '好友'}</div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={onMessage}>
                  <FontAwesomeIcon
                    icon={faComment}
                    style={{
                      fontSize: 25,
                    }}
                  />
                  <div>发消息</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

UserAddProfile.propTypes = {
  friendMessage: PropTypes.object as API.AddFriendVo,
  onAdd: PropTypes.func,
  onMessage: PropTypes.func,
};

UserAddProfile.defaultProps = {
  status: 'offline', // 默认用户状态为离线
  onAdd: () => {},
  onMessage: () => {},
};

export default UserAddProfile;
