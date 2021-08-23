class PlaylistHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongFromPlaylistHandler =
      this.getSongFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this.service.addPlaylist({
      name,
      owner: credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistOwner(playlistId, credentialId);
    await this.service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, credentialId);
    await this.service.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongFromPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this.service.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, credentialId);
    await this.service.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistHandler;
